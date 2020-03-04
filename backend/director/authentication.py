# matchup/authentication.py

from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token

@database_sync_to_async
def get_user(headers):
    # Check proper header present
    if b"sec-websocket-protocol" not in headers:
        return AnonymousUser(), 'sec-websocket-protocol not provided, so no authentication is possible' # we can then reject anonymous users in connect
        
    auth_header = headers[b"sec-websocket-protocol"].split()
    if not auth_header:
        return AnonymousUser(), 'no token provided in sec-websocket-protocol'

    if auth_header[0].lower() != "token,".encode():
        return AnonymousUser(), 'token not identified in header'

    # Check header correctness.
    if len(auth_header) == 1:
        return AnonymousUser(), 'no token provided'
    if len(auth_header) > 2:
        return AnonymousUser(), 'token contains extraneous info'
    try:
        auth_header_token = auth_header[1].decode()
    except UnicodeError:
        return AnonymousUser(), 'token contains invalid symbols'
    
    # Find a user by the token.
    try:
        token = Token.objects.select_related('user').get(key=auth_header_token)
    except Token.DoesNotExist:
        return AnonymousUser(), 'token is invalid'
    if not token.user.is_active:
        # Delete token, since apparently it's fallen into some strange hands
        token.user.auth_token.delete()
        token.user.save()
        return AnonymousUser(), 'token provided for an inactive user'
    
    return token.user, 'authentication successful'

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return TokenAuthMiddlewareInstance(scope, self)

class TokenAuthMiddlewareInstance:
    """
    Token authorization middleware for Channels.

    Authenticate the connection by the header 'Authorization: Token...'
    using Django REST framework token-based authentication.
    """

    def __init__(self, scope, middleware):
        """
        Janky workaround:
        https://github.com/django/channels/issues/1399
        """
        self.middleware = middleware
        self.scope = dict(scope)
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        """
        Add user to the scope by 'Authorization: Token...' header.
        """
        # Only handle "Authorization" headers starting with "Token".
        headers = dict(self.scope["headers"])
        self.scope['user'], self.scope['authentication_message'] = await get_user(headers)

        inner = self.inner(self.scope)
        return await inner(receive, send)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
