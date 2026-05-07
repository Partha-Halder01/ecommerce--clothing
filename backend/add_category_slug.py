import re
from database import execute_query

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text).strip('-')
    return text

def migrate():
    print("Adding slug column to categories table...")
    try:
        execute_query("ALTER TABLE categories ADD COLUMN slug VARCHAR(255) UNIQUE AFTER name")
        print("Slug column added.")
    except Exception as e:
        if "Duplicate column name" in str(e):
            print("Slug column already exists.")
        else:
            print(f"Error adding slug column: {e}")
            return

    print("Populating slugs for existing categories...")
    categories = execute_query("SELECT id, name FROM categories", fetch_all=True)
    for c in categories:
        base = slugify(c['name'])
        slug = base
        i = 1
        while True:
            existing = execute_query("SELECT id FROM categories WHERE slug = %s AND id != %s", (slug, c['id']), fetch_one=True)
            if not existing:
                break
            slug = f"{base}-{i}"
            i += 1
        execute_query("UPDATE categories SET slug = %s WHERE id = %s", (slug, c['id']))
        print(f"Updated category {c['id']}: {c['name']} -> {slug}")

    print("Migration complete.")

if __name__ == "__main__":
    migrate()
