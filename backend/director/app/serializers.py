from rest_framework import serializers
from director.models import Song, SongRequest, User, Party


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class SongSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Song
        fields = ['song_id', 'name', 'artist', 'album', 'album_art']

class SongRequestSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SongRequest
        fields = '__all__'

class PartySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Party
        fields = '__all__'