# director/SpotipyRest/oauth2
# Modification of some of Spotipy's Oauth features, so that we aren't locked into their opinionated caching of tokens

from spotipy import oauth2

class SpotifyOAuthRest(oauth2.SpotifyOAuth):
    def get_cached_token(self):
        """
        Same as spotipy.oauth2.SpotifyOauth's version, except allows us to bypass having a cached token.
        """
        # This allows us to bypass having a cached token, essentially making the
        # "You must either set a cache_path or a username" raised error in the original irrelevant.
        if not self.cache_path and not self.username:
            return None
        return super().get_cached_token()
