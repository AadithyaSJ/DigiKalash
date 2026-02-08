#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

print("=" * 60)
print("EXISTING USERS IN DATABASE")
print("=" * 60)

users = User.objects.all()

if users.exists():
    for user in users:
        print(f"\nUsername: {user.username}")
        print(f"Email: {user.email}")
        print(f"Role: {user.role}")
        print(f"Is Active: {user.is_active}")
        print(f"Is Staff: {user.is_staff}")
        print(f"Is Superuser: {user.is_superuser}")
        print(f"Password Hash: {user.password[:30]}..." if len(user.password) > 30 else f"Password Hash: {user.password}")
        print("-" * 60)
else:
    print("\nNo users found in the database.")

print(f"\nTotal Users: {users.count()}")
print("\nNote: Passwords are stored as hashes and cannot be recovered.")
print("To reset a password, use: python manage.py changepassword <username>")
