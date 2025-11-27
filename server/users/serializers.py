from rest_framework import serializers
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile_image = serializers.ImageField(required=False, allow_null=True)
    artisan_verification_document = serializers.FileField(required=False, allow_null=True)
    researcher_credentials = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'role', 'phone_number', 'bio',
            'profile_image', 'artisan_shop_name', 'artisan_verification_document',
            'researcher_institution', 'researcher_credentials', 'is_staff', "is_verified"
        ]

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image and request:
            return request.build_absolute_uri(obj.profile_image.url)
        return None

    def get_artisan_verification_document_url(self, obj):
        request = self.context.get('request')
        if obj.artisan_verification_document and request:
            return request.build_absolute_uri(obj.artisan_verification_document.url)
        return None

    def get_researcher_credentials_url(self, obj):
        request = self.context.get('request')
        if obj.researcher_credentials and request:
            return request.build_absolute_uri(obj.researcher_credentials.url)
        return None


    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
