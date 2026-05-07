import os
from database import get_connection
from models import create_category, create_product, create_collection, set_collection_products, update_hero_slides

def seed_perfumes():
    print("Clearing existing products, categories, and collections...")
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    cursor.execute("TRUNCATE TABLE collection_products")
    cursor.execute("TRUNCATE TABLE collections")
    cursor.execute("TRUNCATE TABLE products")
    cursor.execute("TRUNCATE TABLE categories")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    conn.commit()
    cursor.close()
    conn.close()

    print("Creating perfume categories...")
    # Men, Women, Unisex
    create_category("Men's Fragrances", "Sophisticated scents for the modern man.")
    create_category("Women's Fragrances", "Elegant and alluring perfumes for her.")
    create_category("Unisex", "Timeless fragrances for everyone.")
    create_category("Gift Sets", "The perfect present for loved ones.")

    print("Creating perfume products...")
    
    products = [
        {
            "name": "Oud Wood Exquisite",
            "category": "Unisex",
            "price": 250.00,
            "original_price": 290.00,
            "stock": 50,
            "description": "A rare, exotic, and distinctive fragrance featuring notes of rose wood, cardamom, and Chinese pepper.",
            "image_url": "/images/perfumes/perfume_hero_banner_1772390798484.png",
            "is_featured": True,
            "sizes": ["50ml", "100ml"]
        },
        {
            "name": "Midnight Rose Essence",
            "category": "Women's Fragrances",
            "price": 185.00,
            "original_price": 200.00,
            "stock": 30,
            "description": "An intoxicating blend of dark rose, vanilla, and patchouli that evokes the mystery of the night.",
            "image_url": "/images/perfumes/perfume_bottle_1_1772390817779.png",
            "is_featured": True,
            "sizes": ["30ml", "50ml", "100ml"]
        },
        {
            "name": "Bergamot Citrus Velvet",
            "category": "Men's Fragrances",
            "price": 140.00,
            "original_price": None,
            "stock": 45,
            "description": "A crisp, fresh opening of bergamot transitioning into a smooth, velvety musk dry down.",
            "image_url": "/images/perfumes/perfume_bottle_2_1772390832537.png",
            "is_featured": True,
            "sizes": ["50ml", "100ml"]
        },
        {
            "name": "Golden Amber Reserve",
            "category": "Unisex",
            "price": 310.00,
            "original_price": 350.00,
            "stock": 15,
            "description": "Rich amber and warm spices create a deeply luxurious and long-lasting scent profile.",
            "image_url": "/images/perfumes/perfume_bottle_1_1772390817779.png",
            "is_featured": False,
            "sizes": ["100ml"]
        },
        {
            "name": "White Jasmine Pure",
            "category": "Women's Fragrances",
            "price": 160.00,
            "original_price": None,
            "stock": 60,
            "description": "A delicate and pure expression of blooming jasmine flowers in the early morning light.",
            "image_url": "/images/perfumes/perfume_bottle_2_1772390832537.png",
            "is_featured": False,
            "sizes": ["50ml", "100ml"]
        }
    ]

    product_ids = []
    for p in products:
        pid = create_product(
            name=p["name"],
            category=p["category"],
            price=p["price"],
            stock=p["stock"],
            description=p["description"],
            image_url=p["image_url"],
            sizes=p["sizes"],
            is_featured=p["is_featured"],
            original_price=p["original_price"]
        )
        product_ids.append(pid)

    print("Creating collections...")
    col1_id = create_collection("Signature Collection", "Our most coveted and iconic fragrances.", "/images/perfumes/perfume_hero_banner_1772390798484.png")
    set_collection_products(col1_id, product_ids[:3])

    col2_id = create_collection("Summer Escapes", "Light, airy scents for the warmer months.", "/images/perfumes/perfume_bottle_1_1772390817779.png")
    set_collection_products(col2_id, product_ids[2:])

    print("Updating hero slides...")
    update_hero_slides([{
        "title": "The Essence of Luxury",
        "subtitle": "Inyou Premium Fragrances",
        "description": "Discover scents that define your presence and leave an unforgettable trail.",
        "image": "/images/perfumes/perfume_hero_banner_1772390798484.png",
        "cta": "Explore Collection",
        "href": "/shop"
    }])

    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_perfumes()
