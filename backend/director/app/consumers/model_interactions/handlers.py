# director/app/consumers/model_interactions/handlers.py

from django.apps import apps
from channels.db import database_sync_to_async

from rest_framework.serializers import ValidationError

from ....models import Party, Song
from ...serializers import SongRequestSerializer, SongSerializer

@database_sync_to_async
def join_party(username, party_code):
    """
    Finds and joins a party, based on the provided code.

    :param str username: the name of the user joining.
    :param str party_code: the unique code identifying the party to join.
    :rtype: bool, str, User, Party
    :return: 
        True if party successfully joined, False otherwise
        message explaining join success/failure
        User object representing the joined user. None if party cannot be joined.
        Party object representing the joined party. None if party cannot be joined.
    """
    parties_matching_code = Party.objects.findPartyByCode(party_code)

    if len(parties_matching_code) < 1:
        return False, 'There is no party with code {}. Please try another code.'.format(party_code), None, None
    elif len(parties_matching_code) > 1:
        error = 'There are {} parties with code {}. Only 1 should exist!'.format(len(parties_matching_code), party_code)
        raise ValidationError(error, code='invalid')
    
    party = parties_matching_code.first()
    user = party.join(username)
    party.save() # TODO: necessary?

    return True, 'Party {} joined successfully!'.format(party_code), user, party

@database_sync_to_async
def leave_party(user_id, party):
    """
    Makes user user_id leave party.

    :param int user_id: the id of the user joining.
    :param Party party: the party object.
    :raises: if user_id does not belong to a user in party ID'd by party_code.
    """
    party.leave(user_id)
    party.save()

@database_sync_to_async
def create_party(user, party_name):
    """
    Has user create party named party_name.

    :param User user: the party host.
    :param str party_name: the name of the party.
    :rtype: Party
    :return: The party object if successful. None otherwise.
    """
    return Party.objects.createParty(user, party_name)

@database_sync_to_async
def add_song_to_queue(user, party, song_data):
    """
    Has user add song to party's queue.

    :param User user: a party guest/host.
    :param Party party: the party.
    :param dict song_data: data pertinent to the song.
    :rtype: bool
    :return: True if successful, False otherwise.
    """
    try:
        song = Song.objects.get(uri=song_data['uri'])
    except:
        song = Song.objects.create(
            uri=song_data['uri'], 
            name=song_data['song_name'],
            artist=song_data['artist_name'],
            album_art=song_data['album_art']
        )
        song.save()
    return party.requestSong(user, song)

@database_sync_to_async
def execute_veto(user, party):
    """
    Attempts to have user veto the current song in the party.
    """
    return False # todo: stub

@database_sync_to_async
def get_queue(party):
    party_queue_list = list(party.getQueue())
    song_list = [SongSerializer(sr.song).data for sr in party_queue_list]
    
    return song_list, party.queue.offset

@database_sync_to_async
def advance_queue(party):
    queue = party.queue
    queue.offset += 1
    queue.save()
    return queue.offset

@database_sync_to_async
def song_at_skip_threshold(user, party):
    party_queue_list = list(party.getQueue())
    offset = party.queue.offset
    song = party_queue_list[offset]
    song.skip_requests.add(user)
    song.save()
    skip_requests = song.get_num_skip_requests()
    skip_percentage = skip_requests / len(party.guests.all())
    return skip_percentage >= party.skipPercentageThreshold
