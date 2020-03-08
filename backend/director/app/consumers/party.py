# director/consumers/party.py

from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework import status
from django.contrib.auth.models import AnonymousUser

import json

from .model_interactions.handlers import join_party, leave_party, create_party, add_song_to_queue, get_queue

class PartyConsumer(AsyncWebsocketConsumer):
    #------------------------------------------------------------------
    # Basic State
    #------------------------------------------------------------------
    user = None
    party = None
    authenticated = False
    
    #------------------------------------------------------------------
    # Web Socket Communicators
    #------------------------------------------------------------------
    async def connect(self):
        """
        Called when first connecting to the socket. You can connect freely, but it doesn't really do anything till you request a join.
        """
        if self.scope['user'] != AnonymousUser():
            self.user = self.scope['user']
            self.authenticated = True
            await self.accept(subprotocol='Token')
        else:
            await self.accept()

    async def disconnect(self, close_code):
        """
        Ensures proper cleanup upon leaving.
        """
        if self.user is None:
            # Do nothing if we haven't joined
            await self.close()
            return

        if self.party is not None:
            await leave_party(self.user.id, self.party)

            if self.authenticated: # if user is host
                await self.channel_layer.group_send(
                    self.party.host_code,
                    {
                        'type': 'party_ended',
                    }
                )

            await self.channel_layer.group_discard(
                self.party.host_code,
                self.channel_name
            )

        await self.close()

    async def receive(self, text_data):
        """
        Parses incoming requests along the Websocket, and passes to the appropriate command handler.
        """
        data = json.loads(text_data)
        if not await self._request_valid(data):
            return

        command = data['command']
        await self.dispatch_command[command](self, data)

    #------------------------------------------------------------------
    # Channel Event Handlers
    # ALL of these can ONLY be called by a call to group_send(), and so must have come from an internal source.
    #------------------------------------------------------------------
    async def chat_message(self, event):
        """
        Send a received chat message to all users.
        """
        message = event['message']
        user = event['user']

        await self._send_channel_message({
            'user': user,
            'command': 'chat',
            'message': message
        })

    async def party_ended(self, event):
        """
        Notify all party members that the party has ended
        """
        await self._send_channel_message(
            {
                'command': 'vacate',
                'message': 'The host has ended the party!'
            }
        )

    async def song_added(self, event):
        """
        Notify all party members that a song has been added
        """
        await self._send_channel_message(
            {
                'command': 'song_added',
                'song': event['data']
            }
        )

    #------------------------------------------------------------------
    # Command Processors
    #------------------------------------------------------------------
    async def _process_join_command(self, data):
        if self.user is not None:
            await self._send_response(
                {
                    'error': 'user already part of a party, cannot join another'
                }, 
                status=status.HTTP_400_BAD_REQUEST,
                id=data['id']
            )
            return

        party = data['party']
        username = data['user']

        successful, reason, user, party = await join_party(username, party)

        if not successful:
            await self._send_response(
                {
                    'error': reason
                }, 
                status=status.HTTP_400_BAD_REQUEST,
                id=data['id']
            )
            return

        self.user = user
        self.party = party

        # Join party's channel group
        await self.channel_layer.group_add(
            self.party.host_code,
            self.channel_name
        )

        await self._send_response(
            {
                'command': 'party',
                'party_code': self.party.host_code,
                'party_name': self.party.name,
                'queue': await get_queue(self.party)
            },
            status=status.HTTP_200_OK,
            id=data['id']
        )

        return

    async def _process_create_command(self, data):
        if not self.authenticated:
            await self._send_response(
                {
                    'error': 'not identified as a Spotify Premium member. Cannot create a party.'
                }, 
                status=status.HTTP_403_FORBIDDEN
            )
            return

        if self.party:
            await self._send_response(
                {
                    'error': 'party already exists, cannot create another'
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
            return

        party_name = data['name']

        party = await create_party(self.user, party_name)

        self.party = party

        # Join party's channel group
        await self.channel_layer.group_add(
            self.party.host_code,
            self.channel_name
        )

        await self._send_response(
            {
                'command': 'party',
                'party_code': self.party.host_code,
                'party_name': self.party.name
            },
            status=status.HTTP_200_OK
        )
        return

    async def _process_chat_command(self, data):
        """
        Handle incoming chat-related commands.
        """
        message = data['message']
        user = self.user.name

        # Send message to match group
        await self.channel_layer.group_send(
            self.party.host_code,
            {
                'type': 'chat_message',
                'message': message,
                'user': user
            }
        )
        await self._send_response(status=status.HTTP_204_NO_CONTENT, id=data['id'])

    async def _process_veto_command(self, data):
        return False # TODO: stub

    async def _process_request_skip_command(self, data):
        return False # TODO: stub

    async def _process_add_song_command(self, data):
        # TODO: need to send song info to everyone else
        if await add_song_to_queue(self.user, self.party, data):
            await self.channel_layer.group_send(
            self.party.host_code,
                {
                    'type': 'song_added',
                    'data': data
                }
            )
            await self._send_response(status=status.HTTP_204_NO_CONTENT, id=data['id'])
            return
        else:
            await self._send_response(
                {
                    'command': 'unavailable',
                    'message': 'Song request failed. Please try again later.',
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
                id=data['id']
            )
            return

    #------------------------------------------------------------------
    # Data Validation
    #------------------------------------------------------------------
    async def _request_valid(self, data):
        """
        Determines if a request is formatted properly, with all appropriate arguments.
        """
        if 'id' not in data:
            await self._send_response({
                'error': 'all requests must include an \'id\' key, valued with a unique integer.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if 'command' not in data:
            await self._send_response({
                'error': 'request must include key \'command\', valued with one of {}.'.format(self.command_groups)
            }, status=status.HTTP_400_BAD_REQUEST, id=data['id'])
            return False

        command_group = data['command']
        if command_group not in self.command_groups:
            await self._send_response({
                'error': '{} is not a valid command.'.format(command_group)
            }, status=status.HTTP_400_BAD_REQUEST, id=data['id'])
            return False

        if command_group in self.non_keyed_command_groups:
            return True

        return await self._command_valid(data, command_group)

    async def _command_valid(self, data, command_group):
        """
        Determines if the necessary arguments have been provided for a request asking for a command in command_group.
        """
        switch = {
            'add_song': self.add_song_commands,
            'chat': self.chat_commands,
            'join': self.join_commands,
            'create': self.create_commands,
        }

        commands = switch[command_group]
        verified_group = False
        for command in commands:
            if command in data:
                if command_group == 'chat':
                    verified_group = True
                    if not isinstance(data[command], str):
                        await self._send_response({
                            'error': 'chat request must include key \'message\' valued to a string.'
                        }, status=status.HTTP_400_BAD_REQUEST, id=data['id'])
                        return False
                elif command_group == 'join':
                    verified_group = True
                    if not isinstance(data[command], str):
                        await self._send_response({
                            'error': 'join request must include both key \'party\' and \'user\', both valued to a string.'
                        }, status=status.HTTP_400_BAD_REQUEST, id=data['id'])
                        return False
                elif command_group == 'create':
                    verified_group = True
                    if not isinstance(data[command], str):
                        await self._send_response({
                            'error': 'create request must include key \'name\' valued to a string.'
                        }, status=status.HTTP_400_BAD_REQUEST, id=data['id'])
                        return False
                elif command_group == 'add_song':
                    verified_group = True
                    error_package = {
                        'error': 'add song request must include key \'name\', \'uri\', \'artist\', \'album_art\' all valued properly.'
                    }
                    if not isinstance(data[command], str):
                        await self._send_response(error_package, status=status.HTTP_400_BAD_REQUEST, id=data['id'])
                        return False
                    if data[command] == 'uri':
                        contains_prefix = data[command].find('spotify:track:') != -1
                        if not contains_prefix:
                            await self._send_response(error_package, status=status.HTTP_400_BAD_REQUEST, id=data['id'])
                            return False
            elif command_group == 'join':
                # if we are missing a join command, we must abort
                await self._send_response({
                    'error': 'join request must include both key \'party\' and \'user\', both valued to a string.'
                }, status=status.HTTP_400_BAD_REQUEST, id=data['id'])
                return False

        if not verified_group:
            await self._send_response({
                'error': '{} request must include key from {}.'.format(command_group, commands)
            }, status=status.HTTP_400_BAD_REQUEST, id=data['id'])
            return False
        
        return True
                

    #------------------------------------------------------------------
    # Command Definitions
    #------------------------------------------------------------------
    # these are specified for doc's sake -- no user can call these, only .send_group() messages can
    channel_commands = [] # TODO: fill this out
    # these are commands which can be called by the user within a command group, hence available in dispatch_command
    chat_commands = ['message']
    add_song_commands = ['song_name', 'album_art', 'artist_name', 'uri']
    join_commands = ['party', 'user']
    create_commands = ['name']
    # non-keyed command groups are ones which need no further info from the user other than the command itself
    non_keyed_command_groups = ['request_skip', 'veto']
    command_groups = ['request_skip', 'chat', 'veto', 'add_song', 'join', 'create']
    dispatch_command = {
        'veto': _process_veto_command,
        'request_skip': _process_request_skip_command,
        'add_song': _process_add_song_command,
        'chat': _process_chat_command,
        'join': _process_join_command,
        'create': _process_create_command,
    }

    #------------------------------------------------------------------
    # Utilities
    #------------------------------------------------------------------
    async def _send_response(self, data = {}, status=status.HTTP_200_OK, id = None): # yes, yes HTTP codes aren't technically correct here, but whatever
        """
        Small wrapper around self.send so we don't have to specify json.dumps and text_data each time we send.
        Intended to send to sockets/clients, not to the channel.
        :param dict data: the data to send.
        :param int status: the status code of the message. Uses HTTP statuses for simplicity. Defaults to 200 OK.
        :param int id: the request id, as per websocket as promised. Excluded if not specified.
        """
        data['status'] = status
        if id is not None: data['id'] = id
        await self.send(text_data=json.dumps(data))

    async def _send_channel_message(self, data):
        """
        Same as _send_response, but it is a message which originated from the channel (hence no status, nor request ID).
        This way, on the user's end, they know this not in response to some request they made.
        :param dict data: the data to send.
        """
        await self.send(text_data=json.dumps(data))
