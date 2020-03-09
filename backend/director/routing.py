# :: director/routing.py
###################################################################
# Routing configuration for Channels. From the docs:
# a Channels routing configuration is similar to a Django URLconf.
# It tells Channels what code to run when an HTTP request is received.
###################################################################
# :: Created By: Benji Brandt <benjibrandt@ucla.edu>
# :: Creation Date: 12 January 2020

from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path

from .app.consumers import PartyConsumer
from .app.consumers.authentication import TokenAuthMiddleware

websocket_urlpatterns = [
    re_path(r'ws/party/$', PartyConsumer),
]

application = ProtocolTypeRouter({
    "websocket": TokenAuthMiddleware(
            URLRouter(
                websocket_urlpatterns
            )
        ),
})
