import psycopg2

wsl_ip = '172.26.25.122'

print(f"Testing connection to WSL PostgreSQL at {wsl_ip}...")

try:
    conn = psycopg2.connect(
        dbname='heritage_db',
        user='root',
        password='Aadithya',
        host=wsl_ip,
        port='5432',
        connect_timeout=5
    )
    print("✓ CONNECTION SUCCESSFUL!")
    
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM heritage_heritagesite;")
    count = cursor.fetchone()[0]
    print(f"Heritage sites in database: {count}")
    
    cursor.execute("SELECT COUNT(*) FROM users_user;")
    user_count = cursor.fetchone()[0]
    print(f"Users in database: {user_count}")
    
    conn.close()
    print("\n✓ Your data is accessible from Windows!")
    
except Exception as e:
    print(f"✗ Connection failed: {e}")
    print("\nMake sure PostgreSQL in WSL is configured to accept connections from Windows.")
    print("You may need to update pg_hba.conf in WSL.")
