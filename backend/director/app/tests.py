from django.test import TestCase
from director.models import *
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
        response = self.client.post(self.spotify_url, format='json')
        self.assertEqual(response.data['error'], 'request is empty')
        self.assertEqual(response.status_code, 400)

    def test_search(self):
        response = self.client.post(self.spotify_url, {'query':'testing'}, format='json')
        self.assertTrue(len(response.data.get('songs', [])) > 3)
        self.assertTrue("test" in response.data['songs'][0]['song_name'] or "Test" in response.data['songs'][0]['song_name'])

class PartyTest(TestCase):
    def setUp(self):
        self.song = Song.objects.create(name='hello')
        self.host = User.objects.create(name='host')
        self.party = Party.objects.createParty(host=self.host)
        self.guest = self.party.join('guest')
    
    def test_can_create_party(self):
        self.assertEqual(self.party.name, "host's party")
    
    def test_can_join_party(self):
        self.assertEqual(len(self.party.getGuests()), 1)
        new_guest = self.party.join('guest2')
        self.assertEqual(len(self.party.getGuests()), 2)
    
    def test_guest_can_request_song(self):
        self.party.requestSong(self.guest, self.song)
        self.assertEqual(len(self.party.getQueue()), 1)

    def test_guest_can_request_skip_song(self):
        self.party.requestSong(self.guest, self.song)
        song_request = SongRequest.objects.filter(requester_id=self.guest)[0]
        self.party.requestSkip(self.guest, song_request)
        self.assertEqual(len(self.party.getQueue()), 0)
    
