"""Create admin user with correct password hash"""
import bcrypt
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

# Generate password hash
password = "Inyou@123"
password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Connect to database
conn = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER', 'root'),
    password=os.getenv('DB_PASSWORD', ''),
    database=os.getenv('DB_NAME', 'ecommerce_clothing_local')
)

cursor = conn.cursor()

# Delete existing admin user if exists
cursor.execute("DELETE FROM users WHERE email = 'admin@inyou.luxury'")

# Insert admin user with correct hash
cursor.execute("""
    INSERT INTO users (first_name, last_name, email, password_hash, is_admin, is_verified) 
    VALUES ('Admin', 'User', 'admin@inyou.luxury', %s, TRUE, TRUE)
""", (password_hash,))

conn.commit()
cursor.close()
conn.close()

print("Admin user created successfully!")
print(f"   Email: admin@inyou.luxury")
print(f"   Password: Inyou@123")
