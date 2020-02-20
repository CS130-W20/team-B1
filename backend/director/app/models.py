from django.db import models
from django.utils.crypto import get_random_string

class Song(models.Model):
    # the custom song_id will be that coming from the music provider
    song_id = models.CharField(max_length=25, primary_key=True)
    name = models.CharField(max_length=50)
    artist = models.CharField(max_length=50)
    album = models.CharField(max_length=50)
    album_art = models.URLField(blank=True)

    def __str__(self):
        return f"{self.name} by {self.artist} (id: {id})"

class User(models.Model):
    # django assigns a primary key id by default
    name = models.CharField(max_length=50)
    join_time = models.DateTimeField(auto_now_add=True)
    def get_song_requests(self):
        return self.songs_requested.all()
    def get_song_skip_requests(self):
        return self.song_skips_requested.all()

    def __str__(self):
        return self.name

class SongRequest(models.Model):
    # django assigns a primary key id by default
    song = models.ForeignKey(Song, on_delete=models.PROTECT)
    request_time = models.DateTimeField(auto_now_add=True)
    requester_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="songs_requested")
    skip_requests = models.ManyToManyField(User, related_name="song_skips_requested", blank=True)

    def get_num_skip_requests(self):
        return len(self.skip_requests.all())

    def __str__(self):
        return f"Request for {self.song}"

class PartyManager(models.Manager):

    def findPartyByHost(self, user):
        return self.filter(host=user)

    def findPartyByCode(self, party_code):
        return self.filter(party_code=party_code)
    
    def createParty(self, host):
        # generate host code until unique
        party_code = get_random_string(length=4, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        while self.filter(party_code=party_code):
            party_code = get_random_string(length=4, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        # create new party instance
        party = self.create(host=host, party_code=party_code)
        return party

class Party(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    party_code = models.CharField(max_length=4, unique=True)
    objects = PartyManager()
    # put more fields here