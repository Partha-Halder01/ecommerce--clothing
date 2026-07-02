"""Migration: add `theme` column to products (page theme preset chosen in admin)."""
from database import execute_query

def migrate():
    try:
        execute_query("ALTER TABLE products ADD COLUMN theme VARCHAR(50) DEFAULT NULL")
        print("Added theme column to products table")
    except Exception as e:
        if "Duplicate column" in str(e):
            print("theme column already exists")
        else:
            raise

if __name__ == "__main__":
    migrate()
    print("Migration complete.")
