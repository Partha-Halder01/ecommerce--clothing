
import json
from database import execute_query
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text).strip('-')
    return text

def migrate():
    print("Adding slug column to products table...")
    try:
        execute_query("ALTER TABLE products ADD COLUMN slug VARCHAR(255) UNIQUE AFTER name")
        print("Slug column added.")
    except Exception as e:
        if "Duplicate column name" in str(e):
            print("Slug column already exists.")
        else:
            print(f"Error adding slug column: {e}")
            return

    print("Populating slugs for existing products...")
    products = execute_query("SELECT id, name FROM products", fetch_all=True)
    for p in products:
        slug = slugify(p['name'])
        # Ensure uniqueness
        base_slug = slug
        counter = 1
        while True:
            existing = execute_query("SELECT id FROM products WHERE slug = %s AND id != %s", (slug, p['id']), fetch_one=True)
            if not existing:
                break
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        execute_query("UPDATE products SET slug = %s WHERE id = %s", (slug, p['id']))
        print(f"Updated product {p['id']}: {p['name']} -> {slug}")

    print("Migration complete.")

if __name__ == "__main__":
    migrate()
