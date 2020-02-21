from django.test import TestCase

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

