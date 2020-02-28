from django.test import TestCase
from director.app.models import *
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .views import MusicService

class MusicServiceTest(APITestCase):
    def setUp(self):
        # URL for creating an account.
        self.login_url = reverse('login')

    def test(self):
        response = self.client.get(self.login_url, format='json')
        self.assertIsNotNone(response.data['location'])

        response = self.client.post(self.login_url, format='json')
        self.assertEqual(response.data['error'], 'Must specify spotify code.')
        self.assertEqual(response.status_code, 400)

        response = self.client.post(self.login_url, {'code': 'lol'}, format='json')
        self.assertEqual(response.data['error'], 'Spotify OAuth call failed due to a bad request.')
        self.assertEqual(response.status_code, 400)

class MusicServiceFactoryTest(APITestCase):
    def setUp(self):
        # URL for creating an account.
        self.spotify_url = reverse('spotify')

    def test(self):
        response = self.client.get(self.spotify_url, format='json')
        self.assertEqual(response.data['error'], 'request is empty')
        self.assertEqual(response.status_code, 400)

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