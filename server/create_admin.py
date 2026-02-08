#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

# Create admin user
username = 'admin'
email = 'admin@example.com'
password = 'admin123'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"✓ Admin user '{username}' created successfully!")
    print(f"  Username: {username}")
    print(f"  Email: {email}")
    print(f"  Password: {password}")
else:
    print(f"✗ Admin user '{username}' already exists")
