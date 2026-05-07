"""Add parent_id column to categories table"""
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

# Check if parent_id column exists
cursor.execute("""
    SELECT COUNT(*) as cnt FROM information_schema.columns 
    WHERE table_schema = %s AND table_name = 'categories' AND column_name = 'parent_id'
""", (os.getenv('DB_NAME', 'ecommerce_clothing_local'),))

result = cursor.fetchone()

if result and result[0] == 0:
    # Add parent_id column
    cursor.execute("ALTER TABLE categories ADD COLUMN parent_id INT NULL")
    print("✅ Added parent_id column to categories table")
else:
    print("ℹ️ parent_id column already exists")

conn.commit()
cursor.close()
conn.close()
