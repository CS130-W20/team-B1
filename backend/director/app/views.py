# app/views.py

import os
import requests
import json

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.serializers import ValidationError
from rest_framework.views import APIView
from rest_framework import permissions, viewsets

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

import spotipy
import spotipy.util
from spotipy import oauth2

from .serializers import UserSerializer, SongSerializer, SongRequestSerializer
from .models import Song, SongRequest, User

SPOTIPY_CLIENT_ID = os.environ.get('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.environ.get('SPOTIPY_CLIENT_SECRET')
SPOTIPY_REDIRECT_URI = os.environ.get('SPOTIPY_REDIRECT_URI')
SCOPE = 'user-read-private playlist-modify-public streaming'
SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search'


# spotipy requiries a username or a cache for some bizarre reason, but you can feed it a bs name
spotify_oauth = oauth2.SpotifyOAuth(SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET, SPOTIPY_REDIRECT_URI, scope=SCOPE, username='__')

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SongRequestViewSet(viewsets.ModelViewSet):
    queryset = SongRequest.objects.all()
    serializer_class = SongRequestSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer


class MusicService(APIView):
    """
    Interacts with the spotify API, based on the passed token, and returns the results.
    @params: {'query': a valid query to search for songs}
    """
    def get(self, request, format='json'):
        self._validate_get_request(request)
        search_url = '{}?q={}&type=track'.format(SPOTIFY_SEARCH_URL, request.data['query'])
        resp = requests.get(search_url, headers={'Authorization': 'Bearer {}'.format(request.data['token'])})
        return Response(json.loads(resp.text), status=resp.status_code)

    def _validate_get_request(self, request):
        if not request.data:
            raise ValidationError({'error': 'request is empty'}, code='invalid')

        if not request.data.get('query'):
            raise ValidationError({'error': 'Search request must specify query string.'}, code='invalid')

        if not request.data.get('token'):
            raise ValidationError({'error': 'Search request must specify valid Spotify API token.'}, code='invalid')


class MusicServiceFactory(APIView):
    """
    @GET: returns the redirect URL for spotify OAuth login.
    @POST: takes {'code': code_generated_by_spotify_oauth}. Saves user, and returns their info and token.
    """
    def get(self, request, format='json'):
        auth_url = spotify_oauth.get_authorize_url()
        return Response({'location': auth_url}, status=status.HTTP_302_FOUND)

    def post(self, request, format='json'):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Must specify spotify code.'}, status=status.HTTP_400_BAD_REQUEST)

        token_info = spotify_oauth.get_access_token(code)
        access_token = token_info['access_token']

        if not access_token:
            return Response({'error': 'Spotify OAuth call failed.'}, status=status.HTTP_401_UNAUTHORIZED)

        spotify = spotipy.Spotify(access_token)
        spotify_data = spotify.current_user()

        if spotify_data.get('product') != 'premium':
            return Response({'error': 'The user account provided is not a Spotify Premium account!'}, status=status.HTTP_403_FORBIDDEN)
        
        user = User(name=spotify_data.get('display_name'))
        user.save()

        return Response({'user': UserSerializer(user, context={'request': request}).data, 'token': access_token}, status=status.HTTP_200_OK)

schema_view = get_schema_view(
   openapi.Info(
      title="Director API",
      default_version='v1',
      description="Real-time music queue for parties",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

