# accounts/views/stats.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.serializers import ValidationError


class MusicService(APIView):
    """
    @auth-required: TODO(benjibrandt): determine auth status after auth setup
    @method-supported: GET, PUT
    @GET: 
        @return: 
            keys: amount, action
            values: 
                amount == amount to add/sub
                action MUST be one of [add, sub]. If add, amount will be added. If sub, amount will be subtracted.

    @PUT: 
        @param stat-type:
            key: games_(won|lost)
            value: positive integer to set the respective field to.
        @return: the newly-updated games_won and games_lost, akin to GET.
    """
    def get(self, request, format='json'):
        return Response(status=status.HTTP_204_NO_CONTENT) # TODO: stub

    def put(self, request, format='json'):
        return Response(status=status.HTTP_204_NO_CONTENT) # TODO: stub

