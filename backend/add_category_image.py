"""Add image_url column to categories table"""
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

conn = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER', 'root'),
    password=os.getenv('DB_PASSWORD', ''),
    database=os.getenv('DB_NAME', 'ecommerce_clothing_local')
)

cursor = conn.cursor()
db_name = os.getenv('DB_NAME', 'ecommerce_clothing_local')

# Check if image_url column exists
cursor.execute("""
    SELECT COUNT(*) as cnt FROM information_schema.columns 
    WHERE table_schema = %s AND table_name = 'categories' AND column_name = 'image_url'
""", (db_name,))

result = cursor.fetchone()

if result and result[0] == 0:
    cursor.execute("ALTER TABLE categories ADD COLUMN image_url VARCHAR(500)")
    print("✅ Added image_url column to categories table")
else:
    print("ℹ️ image_url column already exists")

conn.commit()
cursor.close()
conn.close()
