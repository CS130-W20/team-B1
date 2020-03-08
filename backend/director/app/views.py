# app/views.py

import os
import requests
import json
from datetime import datetime

from django.conf import settings as django_settings

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.serializers import ValidationError
from rest_framework.views import APIView
from rest_framework import permissions, viewsets

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from spotipy import Spotify
from ..SpotipyRest.oauth2 import SpotifyOAuthRest

from .serializers import UserSerializer, SongSerializer, SongRequestSerializer, PartySerializer
from ..models import Song, SongRequest, User, Party, Token

spotify_oauth = SpotifyOAuthRest(
    django_settings.SPOTIPY_CLIENT_ID, 
    django_settings.SPOTIPY_CLIENT_SECRET, 
    django_settings.SPOTIPY_REDIRECT_URI, 
    scope=django_settings.SPOTIPY_SCOPE
)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SongRequestViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows song requests to be viewed or edited.
    """
    queryset = SongRequest.objects.all()
    serializer_class = SongRequestSerializer


class SongViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows songs to be viewed or edited.
    """
    queryset = Song.objects.all()
    serializer_class = SongSerializer

class PartyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows parties to be viewed or edited.
    """
    queryset = Party.objects.all()
    serializer_class = PartySerializer

class MusicService(APIView):
    """
    Interacts with the spotify API, based on the passed token, and returns the results.
    """
    def get(self, request, format='json'):
        """
        :method: GET
        :param str token: a valid Spotify API token.
        :param str query: a valid search query constructed via URL notation to apply to Spotify's backend.
        :rtype: json
        :return:
            key: id, album_art, song
            value: a list of all tracks matching the query, with their associated info
        """
        self._validate_get_request(request)

        spotify = Spotify(request.data['token'])
        result = spotify.search(request.data['query'])
        return Response(self._parse_results(result), status=status.HTTP_200_OK)

    def _parse_results(self, spotipy_results):
        songs = spotipy_results['tracks']['items']
        parsed_result = []
        for song in songs:
            song_result = {}
            song_result['artist_name'] = song['artists'][0]['name']
            song_result['album_art'] = song['album']['images'][1]['url']
            song_result['song_name'] = song['name']
            song_result['uri'] = song['uri']
            song_result['url'] = song['external_urls']['spotify']
            parsed_result.append(song_result)

        return {'songs': parsed_result}



    def _validate_get_request(self, request):
        if not request.data:
            raise ValidationError({'error': 'request is empty'},
                                  code='invalid')

        if not request.data.get('query'):
            raise ValidationError(
                {'error': 'Search request must specify query string.'},
                code='invalid')

        if not request.data.get('token'):
            raise ValidationError(
                {
                    'error':
                    'Search request must specify valid Spotify API token.'
                },
                code='invalid')


class MusicServiceFactory(APIView):
    """
    Handles the authorization flow for Spotify via OAuth2.
    """
    def get(self, request, format='json'):
        """
        :rtype: json
        :return:
            key: location
            value: the spotify authorization URL, to be requested to obtain login via Spotify UI.
        """
        auth_url = spotify_oauth.get_authorize_url()
        return Response({'location': auth_url}, status=status.HTTP_302_FOUND)

    def post(self, request, format='json'):
        """
        :param str code: the spotify authorization code, provided by calling the URL returned by GET.
        :rtype: json
        :return:
            key: user, token
            value: the user's spotify info, and their authorization token for making Spotify API requests
        """
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Must specify spotify code.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try: 
            token_info = spotify_oauth.get_access_token(code)
        except:
            return Response(
                {'error': 'Spotify OAuth call failed due to a bad request.'},
                status=status.HTTP_400_BAD_REQUEST)

        access_token = token_info['access_token']

        if not access_token:
            return Response({'error': 'Spotify OAuth call failed.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        spotify = Spotify(access_token)
        spotify_data = spotify.current_user()

        if spotify_data.get('product') != 'premium':
            return Response(
                {
                    'error': 'The user account provided is not a Spotify Premium account!'
                }, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            user = User.objects.get(spotify_id=spotify_data.get('id'))
        except:
            user = User(name=spotify_data.get('display_name'), spotify_id=spotify_data.get('id'))
            user.save()

        try:
            # since the user got a new token from Spotify, we gotta rid our tracking of the old one
            stored_token = Token.objects.get(user=user)
            stored_token.delete()
        except:
            pass

        stored_token = Token.objects.create(key=access_token, user=user)
        stored_token.created = datetime.utcnow()
        stored_token.save()

        return Response(
            {
                'user': UserSerializer(user, context={
                    'request': request
                }).data,
                'token': access_token
            },
            status=status.HTTP_200_OK)


schema_view = get_schema_view(
    openapi.Info(
        title="Director API",
        default_version='v1',
        description="Real-time music queue for parties",
    ),
    public=True,
    permission_classes=(permissions.AllowAny, ),
)
