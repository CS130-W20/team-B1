from rest_framework import serializers
from director.models import Song, SongRequest, User, Party, PartyQueue


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class SongSerializer(serializers.ModelSerializer):
    song_name = serializers.CharField(source='name')
    artist_name = serializers.CharField(source='artist')

    class Meta:
        model = Song
        fields = ['uri', 'song_name', 'artist_name', 'album_art']

class SongRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SongRequest
        fields = '__all__'

class PartySerializer(serializers.ModelSerializer):
    class Meta:
        model = Party
        fields = '__all__'

class PartyQueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyQueue
        fields = '__all__'
