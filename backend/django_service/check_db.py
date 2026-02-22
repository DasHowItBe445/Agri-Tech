import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        print("Connection successful")
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'qualitymetrics'")
        columns = [row[0] for row in cursor.fetchall()]
        print(f"Columns in qualitymetrics: {columns}")
except Exception as e:
    print(f"Error: {e}")
