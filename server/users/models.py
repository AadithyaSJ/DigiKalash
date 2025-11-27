from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('TOURIST', 'Tourist'),
        ('RESEARCHER', 'Researcher'),
        ('ARTISAN', 'Artisan'),
    ]

    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    # Artisan-specific fields
    artisan_shop_name = models.CharField(max_length=100, blank=True, null=True)
    artisan_verification_document = models.FileField(upload_to='artisan_verification_docs/', blank=True, null=True)

    # Researcher-specific fields
    researcher_institution = models.CharField(max_length=150, blank=True, null=True)
    researcher_credentials = models.FileField(upload_to='researcher_credentials/', blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
