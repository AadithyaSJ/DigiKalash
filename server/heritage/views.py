from datetime import datetime
from django.utils.timezone import now
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import HeritageSite, HeritageEvent, HeritageResource
from .serializer import HeritageSiteSerializer, HeritageEventSerializer, HeritageResourceSerializer
from users.models import User

class HeritageSiteList(generics.ListAPIView):
    queryset = HeritageSite.objects.prefetch_related('events', 'tags').all()
    serializer_class = HeritageSiteSerializer
    permission_classes = [permissions.AllowAny]

class HeritageSiteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = HeritageSite.objects.prefetch_related('events', 'tags').all()
    serializer_class = HeritageSiteSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'pk'

class HeritageSiteCreate(generics.CreateAPIView):
    queryset = HeritageSite.objects.all()
    serializer_class = HeritageSiteSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save()

class HeritageEventList(generics.ListAPIView):
    serializer_class = HeritageEventSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        site_id = self.kwargs.get('site_id')
        return HeritageEvent.objects.filter(site_id=site_id).order_by('date')

class HeritageEventCreate(generics.CreateAPIView):
    serializer_class = HeritageEventSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save()

class HeritageEventDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HeritageEventSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'pk'

    def get_queryset(self):
        site_id = self.kwargs.get('site_id')
        return HeritageEvent.objects.filter(site_id=site_id)

class UpcomingEvents(generics.ListAPIView):
    serializer_class = HeritageEventSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return HeritageEvent.objects.filter(date__gte=now()).order_by('date')

class ImpactNumbers(APIView):
    def get(self, request):
        data = {
            "heritage_sites_preserved": HeritageSite.objects.filter(is_active=True).count(),
            "artisans_registered": User.objects.filter(role='ARTISAN').count(),
            "researchers_registered": User.objects.filter(role='RESEARCHER').count(),
            "tourists_registered": User.objects.filter(role='TOURIST').count(),
            "events": HeritageEvent.objects.filter(date__gte=now()).count(),
        }
        return Response(data)


class HeritageResourceListView(generics.ListAPIView):
    serializer_class = HeritageResourceSerializer
    permission_classes = [permissions.AllowAny]  # customize as needed

    def get_queryset(self):
        site_id = self.kwargs.get("site_id")
        return HeritageResource.objects.filter(site_id=site_id)

class HeritageResourceCreateView(generics.CreateAPIView):
    serializer_class = HeritageResourceSerializer
    permission_classes = [permissions.IsAuthenticated]  # set permission as needed

    def perform_create(self, serializer):
        site_id = self.kwargs.get("site_id")
        serializer.save(site_id=site_id)
