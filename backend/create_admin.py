"""Create/reset the admin user.

Credentials are read from the environment so they are never committed to
source control. Set these in backend/.env (or your shell) before running:

    ADMIN_EMAIL=you@example.com
    ADMIN_PASSWORD=<a strong unique password>

Then run:  python create_admin.py
"""
import os
import sys
import bcrypt
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

admin_email = os.getenv('ADMIN_EMAIL')
admin_password = os.getenv('ADMIN_PASSWORD')

if not admin_email or not admin_password:
    sys.exit(
        "ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment "
        "(e.g. backend/.env) before running this script."
    )

if len(admin_password) < 12:
    sys.exit("ERROR: ADMIN_PASSWORD must be at least 12 characters.")

# Generate password hash
password_hash = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Connect to database
conn = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER', 'root'),
    password=os.getenv('DB_PASSWORD', ''),
    database=os.getenv('DB_NAME', 'ecommerce_clothing_local')
)

cursor = conn.cursor()

# Remove any existing account for this email, then (re)create as admin
cursor.execute("DELETE FROM users WHERE email = %s", (admin_email,))
cursor.execute(
    """
    INSERT INTO users (first_name, last_name, email, password_hash, is_admin, is_verified)
    VALUES ('Admin', 'User', %s, %s, TRUE, TRUE)
    """,
    (admin_email, password_hash),
)

conn.commit()
cursor.close()
conn.close()

print("Admin user created/updated successfully.")
print(f"   Email: {admin_email}")
print("   Password: (set from ADMIN_PASSWORD; not displayed)")
