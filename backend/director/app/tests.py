from django.test import TestCase
from director.app.models import *

class PartyTest(TestCase):
    def setUp(self):
        self.song = Song.objects.create(name='hello', song_id='1')
        self.host = User.objects.create(name='host')
        self.party = Party.objects.createParty(host=self.host)
        self.guest = self.party.join('guest')
    
    def test_can_create_party(self):
        self.assertEqual(self.party.name, "host's party")
    
    def test_can_join_party(self):
        self.assertEqual(len(self.party.getGuests()), 1)
    
    def test_guest_can_request_song(self):
        self.party.requestSong(self.guest, self.song)
        self.assertEqual(len(self.party.getQueue()), 1)
    
    def test_host_can_veto_song(self):
        song_req = self.party.requestSong(self.guest, self.song)
        self.party.vetoSong(self.host, song_req)
        self.assertEqual(len(self.party.getQueue()), 0)
