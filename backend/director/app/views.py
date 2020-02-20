from rest_framework import viewsets
from director.app.serializers import UserSerializer, SongSerializer, SongRequestSerializer, PartySerializer
from director.app.models import Song, SongRequest, User, Party

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

class PartyViewSet(viewsets.ModelViewSet):
    queryset = Party.objects.all()
    serializer_class = PartySerializer