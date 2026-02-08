import sqlite3
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection

# Get all tables
with connection.cursor() as cursor:
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
    tables = cursor.fetchall()
    
    print("=" * 80)
    print("DATABASE TABLES:")
    print("=" * 80)
    for table in tables:
        table_name = table[0]
        print(f"\n{table_name}")
        print("-" * 80)
        
        # Get row count
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"Row count: {count}")
        
        if count > 0 and count <= 10:
            # Show sample data for small tables
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 5")
            rows = cursor.fetchall()
            if rows:
                print("\nSample data:")
                for row in rows:
                    print(f"  {row}")
