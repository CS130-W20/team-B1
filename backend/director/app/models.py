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
        return f"{self.name} by {self.artist} (id: {self.song_id})"

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

class PartyQueue(models.Model):
    queue = models.ManyToManyField(SongRequest, related_name='queue')
    history = models.ManyToManyField(SongRequest, related_name='history')
    skipped = models.ManyToManyField(SongRequest, related_name='skipped')

    def addSong(self, user, song):
        req = SongRequest.objects.create(song=song, requester_id=user)
        if req:
            self.queue.add(req)
        return req
    
    def removeSong(self, song_request):
        self.queue.remove(song_request)
        self.skipped.add(song_request)

    def getQueue(self):
        return self.queue.all()

    def getHistory(self):
        return self.history.all()

    def getSkipped(self):
        return self.skipped.all()

class PartyManager(models.Manager):

    def findPartyByHost(self, user):
        return self.filter(host=user)

    def findPartyByCode(self, host_code):
        return self.filter(host_code=host_code)
    
    def createParty(self, host, name=None, skipPercentageThreshold=0.25):
        if not name:
            name = host.name + "'s party"

        # generate host code until unique
        host_code = get_random_string(length=4, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        while self.filter(host_code=host_code):
            host_code = get_random_string(length=4, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        # create new party instance
        # create party queue instance
        queue = PartyQueue.objects.create()
        party = self.create(host=host, host_code=host_code, name=name, skipPercentageThreshold=skipPercentageThreshold, queue=queue)
        return party

class Party(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='host')
    guests = models.ManyToManyField(User, related_name='guests')
    host_code = models.CharField(max_length=4, unique=True)
    objects = PartyManager()
    name = models.CharField(max_length=25, default='Party')

    skipPercentageThreshold = models.FloatField(default=0.25)
    queue = models.ForeignKey(PartyQueue, on_delete=models.CASCADE, default=None)
    # TODO: musicService

    def getGuests(self):
        return self.guests.all()
    
    def join(self, name):
        user = User.objects.create(name=name)
        self.guests.add(user)
        return user

    def searchForSong(self, query):
        # TODO
        pass
    
    def requestSong(self, user, song):
        ret = self.queue.addSong(user, song)
        return ret
    
    def requestSkip(self, user, song_request):
        song_request.skip_requests.add(user)

        # check if skip threshold is met
        num_skips = song_request.get_num_skip_requests()
        num_guests = len(self.guests.all())
        if num_skips/num_guests > self.skipPercentageThreshold:
            self.queue.removeSong(song_request)
            return True
        
        return False
    
    def vetoSong(self, host, song_request):
        if host == self.host:
            self.queue.removeSong(song_request)
            return True
        return False

    def getQueue(self):
        return self.queue.getQueue()

    def getHistory(self):
        return self.queue.getHistory()
    
    def getSkipped(self):
        return self.queue.getSkipped()
    
