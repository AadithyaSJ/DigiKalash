#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

print("=" * 60)
print("CHANGING PASSWORD FOR ALL USERS TO: 1234")
print("=" * 60)

users = User.objects.all()

if users.exists():
    for user in users:
        user.set_password('1234')
        user.save()
        print(f"✓ Password changed for: {user.username}")
    print("\n" + "=" * 60)
    print(f"SUCCESS! All {users.count()} users' passwords changed to: 1234")
    print("=" * 60)
else:
    print("\nNo users found in the database.")
