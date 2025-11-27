from rest_framework import serializers
from .models import HeritageSite, HeritageEvent, HeritageTag, HeritageResource

class HeritageTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeritageTag
        fields = ['id', 'name']


class HeritageEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeritageEvent
        fields = ['id', 'site', 'title', 'details', 'date']
        # read_only_fields = ['created_by', 'created_at']

class HeritageResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeritageResource
        fields = [
            'id', 'title', 'file', 'filetype', 'size_mb', 'access'
        ]


class HeritageSiteSerializer(serializers.ModelSerializer):
    events = HeritageEventSerializer(many=True, read_only=True)
    tags = HeritageTagSerializer(many=True, read_only=True)
    resources = HeritageResourceSerializer(many=True, read_only=True)

    class Meta:
        model = HeritageSite
        fields = [
            'id', 'name', 'description', 'detailed_description',
            'city', 'state', 'latitude', 'longitude', 'established_year', 
            'site_type', 'tags', 'architect', 'built', 'style',
            'conservation_structural_integrity', 'conservation_preservation_quality',
            'image', 'rating', 'is_active', 'events',

            # Visitor info
            'visitor_timings', 'visitor_fee', 'visitor_best_time', 'visitor_duration',

            # Timeline
            'timeline', 'resources'
        ]

