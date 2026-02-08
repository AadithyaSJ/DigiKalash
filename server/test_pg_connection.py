import psycopg2
import sys

# Try different connection configurations
configs = [
    {
        'name': 'localhost (IPv4)',
        'dbname': 'heritage_db',
        'user': 'root',
        'password': 'Aadithya',
        'host': '127.0.0.1',
        'port': '5432'
    },
    {
        'name': 'localhost (hostname)',
        'dbname': 'heritage_db',
        'user': 'root',
        'password': 'Aadithya',
        'host': 'localhost',
        'port': '5432'
    }
]

print("Testing PostgreSQL connections...")
print("=" * 80)

for config in configs:
    print(f"\nTrying: {config['name']}")
    print(f"  Host: {config['host']}, Port: {config['port']}")
    print(f"  Database: {config['dbname']}, User: {config['user']}")
    
    try:
        conn = psycopg2.connect(
            dbname=config['dbname'],
            user=config['user'],
            password=config['password'],
            host=config['host'],
            port=config['port'],
            connect_timeout=5
        )
        print("  ✓ CONNECTION SUCCESSFUL!")
        
        # Try to query
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        print(f"  PostgreSQL version: {version}")
        
        cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")
        table_count = cursor.fetchone()[0]
        print(f"  Number of tables: {table_count}")
        
        conn.close()
        print(f"\n✓ Use this configuration in settings.py:")
        print(f"  HOST: '{config['host']}'")
        break
        
    except psycopg2.OperationalError as e:
        print(f"  ✗ FAILED: {e}")
    except Exception as e:
        print(f"  ✗ ERROR: {e}")

print("\n" + "=" * 80)
