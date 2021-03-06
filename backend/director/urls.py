"""
director URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path
from rest_framework import routers
from .app import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'songs', views.SongViewSet)
router.register(r'songrequests', views.SongRequestViewSet)
router.register(r'parties', views.PartyViewSet)
router.register(r'queues', views.PartyQueueViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/', include(router.urls)),
    path('login/', views.MusicServiceFactory.as_view(), name='login'),
    path('spotify/', views.MusicService.as_view(), name='spotify'),
    path('docs/',
         views.schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
]
