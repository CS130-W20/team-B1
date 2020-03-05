# director/app/consumers/model_interactions/handlers.py

from django.apps import apps
from channels.db import database_sync_to_async

from rest_framework.serializers import ValidationError

from ....models import Party, Song

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
        return False, 'Party {} does not exist!'.format(party_code), None, None
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
def execute_veto(user, party):
    """
    Attempts to have user veto the current song in the party.
    """
    return False # todo: stub
