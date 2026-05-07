"""Add missing columns to products table"""
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

# Columns to add
columns_to_add = [
    ('original_price', 'DECIMAL(10, 2)'),
    ('category_id', 'INT'),
]

for column, definition in columns_to_add:
    cursor.execute("""
        SELECT COUNT(*) as cnt FROM information_schema.columns 
        WHERE table_schema = %s AND table_name = 'products' AND column_name = %s
    """, (db_name, column))
    
    result = cursor.fetchone()
    
    if result and result[0] == 0:
        cursor.execute(f"ALTER TABLE products ADD COLUMN {column} {definition}")
        print(f"✅ Added {column} column to products table")
    else:
        print(f"ℹ️ {column} column already exists")

conn.commit()
cursor.close()
conn.close()

print("\n✅ Products table fixed!")
