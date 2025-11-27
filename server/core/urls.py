from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # for access and refresh token obtaining
    TokenRefreshView,     # for refreshing access token using refresh token
)
from django.conf.urls.static import static
from django.conf import settings



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('heritage/', include('heritage.urls')),
    path('marketplace/', include('marketplace.urls')),
    # path('events/', include('events.urls')),
    # path('forum/', include('forum.urls')),
    # path('learning/', include('learning.urls')),
    path('users/', include('users.urls')),
    path('heritage/', include('heritage.urls')),
    path('forum/', include('forum.urls')),
    # You can set a homepage or landing page here:
    # path('', include('main_app.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
