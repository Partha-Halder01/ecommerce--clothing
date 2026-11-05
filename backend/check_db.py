import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / '.env')
import mysql.connector

try:
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'ecommerce_clothing')
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SHOW TABLES")
    print("Tables:", cursor.fetchall())
    
    cursor.execute("SELECT id, name, price, stock, status FROM products LIMIT 10")
    print("Products:", cursor.fetchall())
    
    cursor.execute("SELECT COUNT(*) as count FROM products")
    print("Product count:", cursor.fetchone())
    
    cursor.close()
    conn.close()
except Exception as e:
    print("Error:", e)
