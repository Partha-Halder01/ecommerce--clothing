#!/usr/bin/env python3
"""Test database connection"""
from pathlib import Path
from dotenv import load_dotenv
import os
import mysql.connector

# Load .env
env_path = Path(__file__).parent / '.env'
print(f"Loading .env from: {env_path}")
print(f"File exists: {env_path.exists()}")
load_dotenv(dotenv_path=env_path)

# Print env vars
print(f"\nDB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"DB_PASSWORD: {'*' * len(os.getenv('DB_PASSWORD', '')) if os.getenv('DB_PASSWORD') else 'NOT SET'}")

# Test connection
try:
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', ''),
        database=os.getenv('DB_NAME', 'vurel_ecommerce')
    )
    print("\n✅ Database connection SUCCESSFUL!")
    conn.close()
except Exception as e:
    print(f"\n❌ Database connection FAILED: {e}")
