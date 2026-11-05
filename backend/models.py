"""
Data models and database operations for the ecommerce application
"""
import bcrypt
import json
from decimal import Decimal
from database import execute_query

# ==================== USER MODEL ====================

def create_user(first_name, last_name, email, password, is_admin=False):
    """Create a new user"""
    # Hash the password
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    query = """
        INSERT INTO users (first_name, last_name, email, password_hash, is_admin)
        VALUES (%s, %s, %s, %s, %s)
    """
    user_id = execute_query(query, (first_name, last_name, email, password_hash, is_admin))
    return user_id

def find_user_by_email(email):
    """Find a user by email"""
    query = "SELECT * FROM users WHERE email = %s"
    return execute_query(query, (email,), fetch_one=True)

def find_user_by_id(user_id):
    """Find a user by ID"""
    query = "SELECT id, first_name, last_name, email, phone, date_of_birth, is_admin, created_at FROM users WHERE id = %s"
    return execute_query(query, (user_id,), fetch_one=True)

def verify_password(stored_hash, password):
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))

def get_all_customers():
    """Get all non-admin users with their order statistics"""
    query = """
        SELECT 
            u.id, u.first_name, u.last_name, u.email, u.phone, u.created_at,
            COUNT(o.id) as total_orders,
            COALESCE(SUM(o.total), 0) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.is_admin = FALSE
        GROUP BY u.id
        ORDER BY u.created_at DESC
    """
    result = execute_query(query, fetch_all=True)
    for customer in result:
        if customer.get('total_spent'):
            customer['total_spent'] = float(customer['total_spent'])
    return result

# ==================== OTP FUNCTIONS ====================
import random
from datetime import datetime, timedelta

def generate_otp():
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))

def create_otp(email, purpose='register'):
    """Create and store a new OTP code"""
    code = generate_otp()
    expires_at = datetime.now() + timedelta(minutes=10)
    
    # Delete any existing unused OTPs for this email and purpose
    execute_query("DELETE FROM otp_codes WHERE email = %s AND purpose = %s AND used = FALSE", (email, purpose))
    
    # Create new OTP
    query = "INSERT INTO otp_codes (email, code, purpose, expires_at) VALUES (%s, %s, %s, %s)"
    execute_query(query, (email, code, purpose, expires_at))
    return code

def verify_otp(email, code, purpose='register'):
    """Verify an OTP code"""
    query = """
        SELECT * FROM otp_codes 
        WHERE email = %s AND code = %s AND purpose = %s 
        AND used = FALSE AND expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1
    """
    otp = execute_query(query, (email, code, purpose), fetch_one=True)
    
    if otp:
        # Mark OTP as used
        execute_query("UPDATE otp_codes SET used = TRUE WHERE id = %s", (otp['id'],))
        return True
    return False

def set_user_verified(email):
    """Mark user as verified"""
    execute_query("UPDATE users SET is_verified = TRUE WHERE email = %s", (email,))
    return True

def create_user_unverified(first_name, last_name, email, password, phone=None):
    """Create a new unverified user"""
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    query = """
        INSERT INTO users (first_name, last_name, email, password_hash, phone, is_admin, is_verified)
        VALUES (%s, %s, %s, %s, %s, FALSE, FALSE)
    """
    user_id = execute_query(query, (first_name, last_name, email, password_hash, phone))
    return user_id

def get_all_customers():
    """Get all non-admin users with order statistics"""
    query = """
        SELECT 
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.created_at,
            COUNT(o.id) as total_orders,
            COALESCE(SUM(o.total), 0) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.customer_id
        WHERE u.is_admin = FALSE
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone, u.created_at
        ORDER BY u.created_at DESC
    """
    result = execute_query(query, fetch_all=True)
    # Convert Decimal to float for JSON serialization
    for customer in result:
        if customer.get('total_spent'):
            customer['total_spent'] = float(customer['total_spent'])
    return result

# ==================== PRODUCT MODEL ====================

def create_product(name, category, price, stock, description=None, image_url=None,
                   colors=None, sizes=None, gallery_images=None, video_url=None,
                   is_featured=False, faqs=None, related_products=None, original_price=None, slug=None, theme=None):
    """Create a new product"""
    status = 'Active' if stock > 0 else 'Out of Stock'
    if 0 < stock < 20:
        status = 'Low Stock'
    
    # Generate slug if not provided
    if not slug:
        import re
        slug = name.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_-]+', '-', slug).strip('-')
    
    # Convert lists to JSON strings
    colors_json = json.dumps(colors) if colors else '[]'
    sizes_json = json.dumps(sizes) if sizes else '[]'
    gallery_json = json.dumps(gallery_images) if gallery_images else '[]'
    faqs_json = json.dumps(faqs) if faqs else '[]'
    related_json = json.dumps(related_products) if related_products else '[]'
        
    query = """
        INSERT INTO products (name, slug, description, category, price, original_price, stock, status, image_url, colors, sizes, gallery_images, video_url, is_featured, faqs, related_products, theme)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    product_id = execute_query(query, (name, slug, description, category, price, original_price, stock, status, image_url, colors_json, sizes_json, gallery_json, video_url, is_featured, faqs_json, related_json, theme))
    return product_id

def _attach_ratings(products):
    """Add the real rating (approved reviews only) to each product in a list"""
    rows = execute_query(
        "SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count "
        "FROM reviews WHERE is_verified = TRUE GROUP BY product_id",
        fetch_all=True
    )
    ratings = {row['product_id']: row for row in rows}
    for product in products:
        row = ratings.get(product['id'])
        product['rating_average'] = round(float(row['avg_rating']), 1) if row else 0
        product['review_count'] = row['review_count'] if row else 0
    return products

def get_all_products():
    """Get all products"""
    query = "SELECT * FROM products ORDER BY created_at DESC"
    result = execute_query(query, fetch_all=True)
    # Convert Decimal to float and parse JSON fields
    for product in result:
        if product.get('price'):
            product['price'] = float(product['price'])
        if product.get('original_price'):
            product['original_price'] = float(product['original_price'])
        # Parse JSON fields
        if product.get('colors') and isinstance(product['colors'], str):
            product['colors'] = json.loads(product['colors'])
        if product.get('sizes') and isinstance(product['sizes'], str):
            product['sizes'] = json.loads(product['sizes'])
        if product.get('gallery_images') and isinstance(product['gallery_images'], str):
            product['gallery_images'] = json.loads(product['gallery_images'])
        if product.get('faqs') and isinstance(product['faqs'], str):
            product['faqs'] = json.loads(product['faqs'])
        if product.get('related_products') and isinstance(product['related_products'], str):
            product['related_products'] = json.loads(product['related_products'])
    return _attach_ratings(result)

def get_product_by_id(product_id):
    """Get a product by ID"""
    query = "SELECT * FROM products WHERE id = %s"
    result = execute_query(query, (product_id,), fetch_one=True)
    if result:
        if result.get('price'):
            result['price'] = float(result['price'])
        if result.get('original_price'):
            result['original_price'] = float(result['original_price'])
        # Parse JSON fields
        if result.get('colors') and isinstance(result['colors'], str):
            result['colors'] = json.loads(result['colors'])
        if result.get('sizes') and isinstance(result['sizes'], str):
            result['sizes'] = json.loads(result['sizes'])
        if result.get('gallery_images') and isinstance(result['gallery_images'], str):
            result['gallery_images'] = json.loads(result['gallery_images'])
        if result.get('faqs') and isinstance(result['faqs'], str):
            result['faqs'] = json.loads(result['faqs'])
        if result.get('related_products') and isinstance(result['related_products'], str):
            result['related_products'] = json.loads(result['related_products'])
    return result

def get_product_by_slug(slug):
    """Get a product by slug"""
    query = "SELECT * FROM products WHERE slug = %s"
    result = execute_query(query, (slug,), fetch_one=True)
    if result:
        if result.get('price'):
            result['price'] = float(result['price'])
        if result.get('original_price'):
            result['original_price'] = float(result['original_price'])
        # Parse JSON fields
        if result.get('colors') and isinstance(result['colors'], str):
            result['colors'] = json.loads(result['colors'])
        if result.get('sizes') and isinstance(result['sizes'], str):
            result['sizes'] = json.loads(result['sizes'])
        if result.get('gallery_images') and isinstance(result['gallery_images'], str):
            result['gallery_images'] = json.loads(result['gallery_images'])
        if result.get('faqs') and isinstance(result['faqs'], str):
            result['faqs'] = json.loads(result['faqs'])
        if result.get('related_products') and isinstance(result['related_products'], str):
            result['related_products'] = json.loads(result['related_products'])
    return result

def update_product(product_id, **kwargs):
    """Update a product"""
    # Build dynamic update query
    allowed_fields = ['name', 'slug', 'description', 'category', 'price', 'original_price', 'stock', 'image_url', 'video_url', 'is_featured', 'theme']
    json_fields = ['colors', 'sizes', 'gallery_images', 'faqs', 'related_products']
    update_fields = []
    values = []
    
    for field in allowed_fields:
        if field in kwargs and kwargs[field] is not None:
            update_fields.append(f"{field} = %s")
            values.append(kwargs[field])
    
    # Handle JSON fields
    for field in json_fields:
        if field in kwargs and kwargs[field] is not None:
            update_fields.append(f"{field} = %s")
            values.append(json.dumps(kwargs[field]))
    
    # Update status based on stock
    if 'stock' in kwargs:
        stock = kwargs['stock']
        if stock <= 0:
            status = 'Out of Stock'
        elif stock < 20:
            status = 'Low Stock'
        else:
            status = 'Active'
        update_fields.append("status = %s")
        values.append(status)
    
    if not update_fields:
        return False
        
    values.append(product_id)
    query = f"UPDATE products SET {', '.join(update_fields)} WHERE id = %s"
    execute_query(query, values)
    return True

def delete_product(product_id):
    """Delete a product"""
    query = "DELETE FROM products WHERE id = %s"
    execute_query(query, (product_id,))
    return True

# ==================== ORDER MODEL ====================

def create_order(customer_id, items, total, shipping_address=None, payment_method=None, customer_name=None, customer_email=None, customer_phone=None, payment_id=None):
    """Create a new order"""
    items_json = json.dumps(items)
    query = """
        INSERT INTO orders (customer_id, customer_name, customer_email, customer_phone, items, total, shipping_address, payment_method, payment_id, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'Pending')
    """
    order_id = execute_query(query, (customer_id, customer_name, customer_email, customer_phone, items_json, total, shipping_address, payment_method, payment_id))
    return order_id

def get_all_orders():
    """Get all orders with customer info"""
    query = """
        SELECT 
            o.id,
            o.customer_id,
            COALESCE(o.customer_name, CONCAT(u.first_name, ' ', u.last_name)) as customer_name,
            COALESCE(o.customer_email, u.email) as customer_email,
            o.customer_phone,
            o.total,
            o.status,
            o.items,
            o.shipping_address,
            o.payment_method,
            o.created_at
        FROM orders o
        LEFT JOIN users u ON o.customer_id = u.id
        ORDER BY o.created_at DESC
    """
    result = execute_query(query, fetch_all=True)
    for order in result:
        if order.get('total'):
            order['total'] = float(order['total'])
        if order.get('items') and isinstance(order['items'], str):
            order['items'] = json.loads(order['items'])
    return result

def get_user_orders(user_id):
    """Get all orders for a specific user"""
    query = """
        SELECT 
            o.id,
            o.customer_id,
            COALESCE(o.customer_name, CONCAT(u.first_name, ' ', u.last_name)) as customer_name,
            COALESCE(o.customer_email, u.email) as customer_email,
            o.customer_phone,
            o.total,
            o.status,
            o.items,
            o.shipping_address,
            o.payment_method,
            o.created_at
        FROM orders o
        LEFT JOIN users u ON o.customer_id = u.id
        WHERE o.customer_id = %s OR o.customer_email = (SELECT email FROM users WHERE id = %s)
        ORDER BY o.created_at DESC
    """
    result = execute_query(query, (user_id, user_id), fetch_all=True)
    for order in result:
        if order.get('total'):
            order['total'] = float(order['total'])
        if order.get('items') and isinstance(order['items'], str):
            order['items'] = json.loads(order['items'])
    return result

def get_order_by_id(order_id, user_id=None):
    """Get a specific order, optionally filtered by user"""
    query = """
        SELECT 
            o.id,
            o.customer_id,
            COALESCE(o.customer_name, CONCAT(u.first_name, ' ', u.last_name)) as customer_name,
            COALESCE(o.customer_email, u.email) as customer_email,
            o.customer_phone,
            o.total,
            o.status,
            o.items,
            o.shipping_address,
            o.payment_method,
            o.created_at
        FROM orders o
        LEFT JOIN users u ON o.customer_id = u.id
        WHERE o.id = %s
    """
    params = [order_id]
    
    result = execute_query(query, params, fetch_one=True)
    if result:
        if result.get('total'):
            result['total'] = float(result['total'])
        if result.get('items') and isinstance(result['items'], str):
            result['items'] = json.loads(result['items'])
    return result

def update_order_status(order_id, status):
    """Update an order's status"""
    # If status is Delivered, also set completed_at timestamp
    if status == 'Delivered':
        query = "UPDATE orders SET status = %s, completed_at = NOW() WHERE id = %s"
    else:
        query = "UPDATE orders SET status = %s WHERE id = %s"
    execute_query(query, (status, order_id))
    return True

def update_order_shiprocket_details(order_id, sr_order_id, shipment_id, awb_code):
    """Update order with Shiprocket tracking details"""
    query = "UPDATE orders SET shiprocket_order_id = %s, shiprocket_shipment_id = %s, awb_code = %s WHERE id = %s"
    execute_query(query, (sr_order_id, shipment_id, awb_code, order_id))
    return True

# ==================== DASHBOARD STATS ====================

def get_dashboard_stats():
    """Get dashboard statistics"""
    # Total revenue
    revenue_query = "SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'Cancelled'"
    revenue_result = execute_query(revenue_query, fetch_one=True)
    total_revenue = float(revenue_result['total']) if revenue_result['total'] else 0
    
    # Total orders
    orders_query = "SELECT COUNT(*) as total FROM orders"
    orders_result = execute_query(orders_query, fetch_one=True)
    total_orders = orders_result['total'] or 0
    
    # Total products
    products_query = "SELECT COUNT(*) as total FROM products"
    products_result = execute_query(products_query, fetch_one=True)
    total_products = products_result['total'] or 0
    
    # Total customers
    customers_query = "SELECT COUNT(*) as total FROM users WHERE is_admin = FALSE"
    customers_result = execute_query(customers_query, fetch_one=True)
    total_customers = customers_result['total'] or 0
    
    # Recent orders
    recent_query = """
        SELECT 
            o.id,
            CONCAT(u.first_name, ' ', u.last_name) as customer,
            u.email,
            o.total,
            o.status
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
    """
    recent_orders = execute_query(recent_query, fetch_all=True)
    for order in recent_orders:
        if order.get('total'):
            order['total'] = float(order['total'])
    
    return {
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'total_products': total_products,
        'total_customers': total_customers,
        'recent_orders': recent_orders
    }

def get_weekly_stats():
    """Get daily stats for the last 7 days"""
    query = """
        SELECT 
            DATE(created_at) as date,
            DAYNAME(created_at) as day_name,
            COUNT(*) as orders,
            COALESCE(SUM(total), 0) as revenue
        FROM orders 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            AND status != 'Cancelled'
        GROUP BY DATE(created_at), DAYNAME(created_at)
        ORDER BY DATE(created_at) ASC
    """
    results = execute_query(query, fetch_all=True)
    
    # Create a map for all 7 days with default values
    from datetime import datetime, timedelta
    days_map = {}
    day_names = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    
    # Initialize all days with 0
    for i in range(7):
        date = datetime.now() - timedelta(days=6-i)
        day_abbr = day_names[date.weekday()]
        days_map[date.strftime('%Y-%m-%d')] = {
            'name': day_abbr,
            'revenue': 0,
            'orders': 0
        }
    
    # Fill in actual data
    for row in results:
        date_str = row['date'].strftime('%Y-%m-%d') if hasattr(row['date'], 'strftime') else str(row['date'])
        if date_str in days_map:
            days_map[date_str]['revenue'] = float(row['revenue']) if row['revenue'] else 0
            days_map[date_str]['orders'] = int(row['orders']) if row['orders'] else 0
    
    # Convert to list in order
    weekly_data = list(days_map.values())
    
    return weekly_data

# ==================== CATEGORY MODEL ====================

def create_category(name, description=None, parent_id=None, image_url=None, slug=None):
    """Create a new category or subcategory"""
    # Generate slug if not provided
    if not slug:
        import re
        slug = name.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_-]+', '-', slug).strip('-')
    query = "INSERT INTO categories (name, slug, description, parent_id, image_url) VALUES (%s, %s, %s, %s, %s)"
    return execute_query(query, (name, slug, description, parent_id, image_url))

def get_all_categories():
    """Get all categories with parent info"""
    query = """SELECT c.*, p.name as parent_name 
               FROM categories c 
               LEFT JOIN categories p ON c.parent_id = p.id 
               ORDER BY COALESCE(c.parent_id, c.id), c.parent_id IS NOT NULL, c.name ASC"""
    return execute_query(query, fetch_all=True)

def get_active_categories():
    """Get active categories only (includes hierarchy)"""
    query = """SELECT c.*, p.name as parent_name 
               FROM categories c 
               LEFT JOIN categories p ON c.parent_id = p.id 
               WHERE c.is_active = TRUE 
               ORDER BY COALESCE(c.parent_id, c.id), c.parent_id IS NOT NULL, c.name ASC"""
    return execute_query(query, fetch_all=True)

def get_categories_with_subcategories():
    """Get categories grouped with their subcategories"""
    # Get parent categories
    query = "SELECT * FROM categories WHERE parent_id IS NULL AND is_active = TRUE ORDER BY name ASC"
    parents = execute_query(query, fetch_all=True)
    
    # Get all subcategories
    query = "SELECT * FROM categories WHERE parent_id IS NOT NULL AND is_active = TRUE ORDER BY name ASC"
    subs = execute_query(query, fetch_all=True)
    
    # Group subcategories by parent
    for parent in parents:
        parent['subcategories'] = [s for s in subs if s.get('parent_id') == parent.get('id')]
    
    return parents

def update_category(category_id, name=None, description=None, is_active=None, parent_id=None, image_url=None, slug=None):
    """Update a category"""
    updates = []
    values = []
    if name is not None:
        updates.append("name = %s")
        values.append(name)
    if slug is not None:
        updates.append("slug = %s")
        values.append(slug)
    if description is not None:
        updates.append("description = %s")
        values.append(description)
    if is_active is not None:
        updates.append("is_active = %s")
        values.append(is_active)
    if parent_id is not None:
        updates.append("parent_id = %s")
        values.append(parent_id if parent_id != 0 else None)
    if image_url is not None:
        updates.append("image_url = %s")
        values.append(image_url)
    if not updates:
        return False
    values.append(category_id)
    query = f"UPDATE categories SET {', '.join(updates)} WHERE id = %s"
    execute_query(query, values)
    return True

def delete_category(category_id):
    """Delete a category and its subcategories"""
    # First delete subcategories
    execute_query("DELETE FROM categories WHERE parent_id = %s", (category_id,))
    # Then delete the category
    query = "DELETE FROM categories WHERE id = %s"
    execute_query(query, (category_id,))
    return True

# ==================== SITE SETTINGS MODEL ====================

def get_setting(key):
    """Get a setting by key"""
    query = "SELECT setting_value FROM site_settings WHERE setting_key = %s"
    result = execute_query(query, (key,), fetch_one=True)
    if result and result.get('setting_value'):
        value = result['setting_value']
        return json.loads(value) if isinstance(value, str) else value
    return None

def update_setting(key, value):
    """Update or create a setting"""
    json_value = json.dumps(value)
    query = """
        INSERT INTO site_settings (setting_key, setting_value) VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE setting_value = %s
    """
    execute_query(query, (key, json_value, json_value))
    return True

def get_sale_banner():
    """Get sale banner settings"""
    return get_setting('sale_banner') or {
        'enabled': True,
        'text': 'LIMITED TIME OFFER - UP TO 50% OFF',
        'end_date': '2025-12-31T23:59:59'
    }

def update_sale_banner(enabled, text, end_date):
    """Update sale banner settings"""
    return update_setting('sale_banner', {
        'enabled': enabled,
        'text': text,
        'end_date': end_date
    })

# ==================== HERO SETTINGS ====================

def get_hero_slides():
    """Get hero slider settings"""
    return get_setting('hero_slides') or {
        'slides': [],
        'recommended_size': '1920x1080'
    }

def update_hero_slides(slides, recommended_size='1920x1080'):
    """Update hero slides"""
    return update_setting('hero_slides', {
        'slides': slides,
        'recommended_size': recommended_size
    })

def get_scrolling_text():
    """Get scrolling text settings"""
    return get_setting('scrolling_text') or {
        'enabled': True,
        'text': 'Free Shipping on Orders Over $100'
    }

def update_scrolling_text(enabled, text):
    """Update scrolling text"""
    return update_setting('scrolling_text', {
        'enabled': enabled,
        'text': text
    })

# ==================== AUTH PAGE IMAGES ====================

def get_auth_pages():
    """Get login/signup page background image settings"""
    return get_setting('auth_pages') or {
        'login_image': 'https://inyou.shop/uploads/products/523c80b2900c4a5e93a3ed1c7f8c17fc.jpeg',
        'signup_image': 'https://inyou.shop/uploads/products/ecce669f0da64042aa1fd5e1e68feebd.jpeg',
    }

def update_auth_pages(login_image, signup_image):
    """Update login/signup page background images"""
    return update_setting('auth_pages', {
        'login_image': login_image, 'signup_image': signup_image
    })

# ==================== HOMEPAGE SECTIONS ====================

def get_our_story():
    """Get Our Story section settings"""
    return get_setting('our_story') or {
        'enabled': True, 'title': 'Our Story', 'description': '', 'video_url': ''
    }

def update_our_story(enabled, title, description, video_url):
    """Update Our Story section"""
    return update_setting('our_story', {
        'enabled': enabled, 'title': title, 'description': description, 'video_url': video_url
    })

def get_testimonials():
    """Get testimonials section settings"""
    return get_setting('testimonials') or {
        'enabled': True, 'title': 'What Our Fellows Say', 'videos': []
    }

def update_testimonials(enabled, title, videos):
    """Update testimonials section"""
    return update_setting('testimonials', {
        'enabled': enabled, 'title': title, 'videos': videos
    })

def get_shop_the_look():
    """Get Shop The Look section settings"""
    return get_setting('shop_the_look') or {
        'enabled': True, 'title': 'Shop The Look', 'product_ids': []
    }

def update_shop_the_look(enabled, title, product_ids):
    """Update Shop The Look section"""
    return update_setting('shop_the_look', {
        'enabled': enabled, 'title': title, 'product_ids': product_ids
    })

# ==================== FEATURED PRODUCTS ====================

def get_featured_products():
    """Get featured products"""
    query = "SELECT * FROM products WHERE is_featured = TRUE ORDER BY created_at DESC"
    result = execute_query(query, fetch_all=True)
    for product in result:
        if product.get('price'):
            product['price'] = float(product['price'])
        if product.get('colors') and isinstance(product['colors'], str):
            product['colors'] = json.loads(product['colors'])
        if product.get('sizes') and isinstance(product['sizes'], str):
            product['sizes'] = json.loads(product['sizes'])
        if product.get('gallery_images') and isinstance(product['gallery_images'], str):
            product['gallery_images'] = json.loads(product['gallery_images'])
    return _attach_ratings(result)

def set_product_featured(product_id, is_featured):
    """Set product featured status"""
    query = "UPDATE products SET is_featured = %s WHERE id = %s"
    execute_query(query, (is_featured, product_id))
    return True

# ==================== COLLECTIONS ====================

def create_collection(title, description=None, cover_image=None, format_type='short'):
    """Create a new collection"""
    query = """INSERT INTO collections (title, description, cover_image, format_type) 
               VALUES (%s, %s, %s, %s)"""
    return execute_query(query, (title, description, cover_image, format_type))

def get_all_collections():
    """Get all collections with product count"""
    query = """
        SELECT c.*, COUNT(cp.product_id) as product_count 
        FROM collections c 
        LEFT JOIN collection_products cp ON c.id = cp.collection_id 
        GROUP BY c.id 
        ORDER BY c.display_order ASC, c.created_at DESC
    """
    return execute_query(query, fetch_all=True)

def get_home_collections():
    """Get collections to show on home page (max 3)"""
    query = """
        SELECT c.*, COUNT(cp.product_id) as product_count 
        FROM collections c 
        LEFT JOIN collection_products cp ON c.id = cp.collection_id 
        WHERE c.show_on_home = TRUE AND c.is_active = TRUE
        GROUP BY c.id 
        ORDER BY c.display_order ASC 
        LIMIT 3
    """
    return execute_query(query, fetch_all=True)

def get_collection_by_id(collection_id):
    """Get collection by ID with product count"""
    query = """
        SELECT c.*, COUNT(cp.product_id) as product_count 
        FROM collections c 
        LEFT JOIN collection_products cp ON c.id = cp.collection_id 
        WHERE c.id = %s
        GROUP BY c.id
    """
    return execute_query(query, (collection_id,), fetch_one=True)

def update_collection(collection_id, **kwargs):
    """Update a collection"""
    updates = []
    values = []
    for key in ['title', 'description', 'cover_image', 'format_type', 'is_active', 'show_on_home', 'display_order']:
        if key in kwargs and kwargs[key] is not None:
            updates.append(f"{key} = %s")
            values.append(kwargs[key])
    if not updates:
        return False
    values.append(collection_id)
    query = f"UPDATE collections SET {', '.join(updates)} WHERE id = %s"
    execute_query(query, values)
    return True

def delete_collection(collection_id):
    """Delete a collection"""
    query = "DELETE FROM collections WHERE id = %s"
    execute_query(query, (collection_id,))
    return True

# Collection Products Management
def add_product_to_collection(collection_id, product_id):
    """Add a product to a collection"""
    query = "INSERT IGNORE INTO collection_products (collection_id, product_id) VALUES (%s, %s)"
    execute_query(query, (collection_id, product_id))
    return True

def remove_product_from_collection(collection_id, product_id):
    """Remove a product from a collection"""
    query = "DELETE FROM collection_products WHERE collection_id = %s AND product_id = %s"
    execute_query(query, (collection_id, product_id))
    return True

def get_collection_products(collection_id):
    """Get all products in a collection"""
    query = """
        SELECT p.* FROM products p 
        JOIN collection_products cp ON p.id = cp.product_id 
        WHERE cp.collection_id = %s 
        ORDER BY cp.display_order ASC
    """
    result = execute_query(query, (collection_id,), fetch_all=True)
    for product in result:
        if product.get('price'):
            product['price'] = float(product['price'])
        if product.get('colors') and isinstance(product['colors'], str):
            product['colors'] = json.loads(product['colors'])
        if product.get('sizes') and isinstance(product['sizes'], str):
            product['sizes'] = json.loads(product['sizes'])
        if product.get('gallery_images') and isinstance(product['gallery_images'], str):
            product['gallery_images'] = json.loads(product['gallery_images'])
    return _attach_ratings(result)

def set_collection_products(collection_id, product_ids):
    """Set all products for a collection (replaces existing)"""
    # Remove existing
    execute_query("DELETE FROM collection_products WHERE collection_id = %s", (collection_id,))
    # Add new
    for idx, product_id in enumerate(product_ids):
        query = "INSERT INTO collection_products (collection_id, product_id, display_order) VALUES (%s, %s, %s)"
        execute_query(query, (collection_id, product_id, idx))
    return True

# ==================== COUPONS ====================

def create_coupon(code, discount_type, discount_value, min_order_amount=0, max_uses=None, expires_at=None, max_order_amount=None):
    """Create a new coupon"""
    query = """
        INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_uses, expires_at, max_order_amount)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    return execute_query(query, (code.upper(), discount_type, discount_value, min_order_amount, max_uses, expires_at, max_order_amount))

def get_all_coupons():
    """Get all coupons"""
    result = execute_query("SELECT * FROM coupons ORDER BY created_at DESC", fetch_all=True)
    for coupon in result:
        if coupon.get('discount_value'):
            coupon['discount_value'] = float(coupon['discount_value'])
        if coupon.get('min_order_amount'):
            coupon['min_order_amount'] = float(coupon['min_order_amount'])
        if coupon.get('max_order_amount'):
            coupon['max_order_amount'] = float(coupon['max_order_amount'])
    return result

def get_coupon_by_code(code):
    """Get coupon by code"""
    result = execute_query("SELECT * FROM coupons WHERE code = %s AND is_active = TRUE", (code.upper(),), fetch_one=True)
    if result:
        if result.get('discount_value'):
            result['discount_value'] = float(result['discount_value'])
        if result.get('min_order_amount'):
            result['min_order_amount'] = float(result['min_order_amount'])
        if result.get('max_order_amount'):
            result['max_order_amount'] = float(result['max_order_amount'])
    return result

def validate_coupon(code, order_total):
    """Validate a coupon and return discount amount"""
    coupon = get_coupon_by_code(code)
    if not coupon:
        return None, "Invalid coupon code"
    
    # Check expiry
    if coupon.get('expires_at'):
        from datetime import datetime
        if datetime.now() > coupon['expires_at']:
            return None, "Coupon has expired"
    
    # Check usage limit
    if coupon.get('max_uses') and coupon['used_count'] >= coupon['max_uses']:
        return None, "Coupon usage limit reached"
    
    # Check minimum order
    if order_total < coupon['min_order_amount']:
        return None, f"Minimum order amount is ₹{coupon['min_order_amount']:.0f}"
    
    # Check maximum order (empty means no limit)
    if coupon.get('max_order_amount') and order_total > coupon['max_order_amount']:
        return None, f"This coupon is only valid on orders up to ₹{coupon['max_order_amount']:.0f}"
    
    # Calculate discount
    if coupon['discount_type'] == 'percentage':
        discount = order_total * (coupon['discount_value'] / 100)
    else:
        discount = coupon['discount_value']
    
    return round(min(discount, order_total), 2), coupon

# ==================== ORDER PRICING ====================

class OrderPricingError(Exception):
    """An order can't be priced; `pricing` tells the checkout page what changed."""
    def __init__(self, message, status=400, pricing=None):
        super().__init__(message)
        self.message = message
        self.status = status
        self.pricing = pricing

def build_order_items(items, require_active=True):
    """Check cart lines and replace their prices with the real ones from the database"""
    if not isinstance(items, list) or not items:
        raise OrderPricingError("Your cart is empty. Please refresh the page and try again.")
    built = []
    for item in items:
        try:
            product_id = int(item['id'])
            quantity = int(item['quantity'])
            if quantity != float(item['quantity']) or not 1 <= quantity <= 1000:
                raise ValueError
        except (KeyError, TypeError, ValueError):
            raise OrderPricingError("Your cart has an invalid item. Please refresh the page and try again.")
        product = get_product_by_id(product_id)
        if not product:
            if require_active:
                raise OrderPricingError("A product in your cart is no longer available.")
            built.append({**item, 'id': product_id, 'quantity': quantity})
            continue
        if require_active and str(product.get('status', '')).lower() != 'active':
            raise OrderPricingError(f"{product['name']} is no longer available.")
        built.append({**item, 'id': product_id, 'quantity': quantity, 'name': product['name'], 'price': float(product['price'])})
    return built

def price_order(items, coupon_code=None):
    """Work out an order's total from database prices, the coupon and shipping settings"""
    built = build_order_items(items)
    subtotal = round(sum(item['price'] * item['quantity'] for item in built), 2)

    discount = 0
    coupon_id = None
    if coupon_code:
        discount, result = validate_coupon(coupon_code, subtotal)
        if discount is None:
            raise OrderPricingError(result)
        coupon_id = result['id']

    shipping = get_setting('shipping_settings') or {'free_delivery_minimum': 800, 'delivery_charge': 85}
    free_minimum = float(shipping.get('free_delivery_minimum', 800))
    delivery_charge = float(shipping.get('delivery_charge', 85))
    shipping_cost = 0 if subtotal >= free_minimum else delivery_charge

    return {
        'items': built,
        'subtotal': subtotal,
        'discount': discount,
        'shipping': shipping_cost,
        'total': round(subtotal - discount + shipping_cost, 2),
        'coupon_id': coupon_id,
        'free_delivery_minimum': free_minimum,
        'delivery_charge': delivery_charge,
    }

def check_expected_total(pricing, expected_total):
    """Stop if the customer was shown a different total from the real one"""
    if expected_total is None:
        return
    try:
        matches = abs(float(expected_total) - pricing['total']) <= 0.01
    except (TypeError, ValueError):
        matches = False
    if not matches:
        raise OrderPricingError(
            "Prices have changed. Please review your new total and try again.",
            status=409,
            pricing={
                'prices': {str(item['id']): item['price'] for item in pricing['items']},
                'free_delivery_minimum': pricing['free_delivery_minimum'],
                'delivery_charge': pricing['delivery_charge'],
            },
        )

def get_order_id_by_payment_id(payment_id):
    """Find an order that already used this payment"""
    row = execute_query("SELECT id FROM orders WHERE payment_id = %s", (payment_id,), fetch_one=True)
    return row['id'] if row else None

def use_coupon(coupon_id):
    """Increment coupon usage count"""
    execute_query("UPDATE coupons SET used_count = used_count + 1 WHERE id = %s", (coupon_id,))

def update_coupon(coupon_id, **kwargs):
    """Update a coupon"""
    fields = []
    values = []
    for key, value in kwargs.items():
        if key in ['code', 'discount_type', 'discount_value', 'min_order_amount', 'max_order_amount', 'max_uses', 'expires_at', 'is_active']:
            fields.append(f"{key} = %s")
            values.append(value.upper() if key == 'code' else value)
    if fields:
        values.append(coupon_id)
        query = f"UPDATE coupons SET {', '.join(fields)} WHERE id = %s"
        execute_query(query, tuple(values))
    return True

def delete_coupon(coupon_id):
    """Delete a coupon"""
    execute_query("DELETE FROM coupons WHERE id = %s", (coupon_id,))
    return True

# ==================== REVIEWS ====================

def create_review(product_id, reviewer_name, rating, review_text, user_id=None, is_admin_review=False, is_verified=False):
    """Create a new review"""
    query = """
        INSERT INTO reviews (product_id, user_id, reviewer_name, rating, review_text, is_admin_review, is_verified)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    return execute_query(query, (product_id, user_id, reviewer_name, rating, review_text, is_admin_review, is_verified))

def get_product_reviews(product_id, verified_only=True):
    """Get reviews for a product"""
    if verified_only:
        query = "SELECT * FROM reviews WHERE product_id = %s AND is_verified = TRUE ORDER BY created_at DESC"
    else:
        query = "SELECT * FROM reviews WHERE product_id = %s ORDER BY created_at DESC"
    return execute_query(query, (product_id,), fetch_all=True)

def get_all_reviews():
    """Get all reviews for admin"""
    query = """
        SELECT r.*, p.name as product_name 
        FROM reviews r 
        JOIN products p ON r.product_id = p.id 
        ORDER BY r.created_at DESC
    """
    return execute_query(query, fetch_all=True)

def verify_review(review_id, verified=True):
    """Verify or unverify a review"""
    execute_query("UPDATE reviews SET is_verified = %s WHERE id = %s", (verified, review_id))
    return True

def delete_review(review_id):
    """Delete a review"""
    execute_query("DELETE FROM reviews WHERE id = %s", (review_id,))
    return True

def get_product_rating(product_id):
    """Get average rating for a product"""
    result = execute_query(
        "SELECT AVG(rating) as avg_rating, COUNT(*) as review_count FROM reviews WHERE product_id = %s AND is_verified = TRUE",
        (product_id,), fetch_one=True
    )
    return {
        'average': float(result['avg_rating']) if result and result['avg_rating'] else 0,
        'count': result['review_count'] if result else 0
    }

# ==================== CONTACT SUBMISSIONS MODEL ====================

def create_contact(first_name, last_name, email, subject, message, phone):
    """Create a new contact submission"""
    query = """
        INSERT INTO contact_submissions (first_name, last_name, email, subject, message, phone)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    contact_id = execute_query(query, (first_name, last_name, email, subject, message, phone))
    return contact_id

def get_all_contacts():
    """Get all contact submissions"""
    query = "SELECT * FROM contact_submissions ORDER BY created_at DESC"
    return execute_query(query, fetch_all=True)

def get_contact_by_id(contact_id):
    """Get a contact submission by ID"""
    query = "SELECT * FROM contact_submissions WHERE id = %s"
    return execute_query(query, (contact_id,), fetch_one=True)

def update_contact_status(contact_id, status):
    """Update contact submission status"""
    query = "UPDATE contact_submissions SET status = %s WHERE id = %s"
    execute_query(query, (status, contact_id))
    return True

def delete_contact(contact_id):
    """Delete a contact submission"""
    execute_query("DELETE FROM contact_submissions WHERE id = %s", (contact_id,))
    return True

# ==================== BLOGS MODEL ====================

def create_blog(title, content, summary=None, image_url=None, author='Admin', is_published=True, slug=None):
    """Create a new blog post"""
    if not slug:
        import re
        slug = title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[\s_-]+', '-', slug).strip('-')
    
    # Check if slug already exists, and append number if it does
    original_slug = slug
    counter = 1
    while True:
        existing = execute_query("SELECT id FROM blogs WHERE slug = %s", (slug,), fetch_one=True)
        if not existing:
            break
        slug = f"{original_slug}-{counter}"
        counter += 1

    query = """
        INSERT INTO blogs (title, slug, content, summary, image_url, author, is_published)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    return execute_query(query, (title, slug, content, summary, image_url, author, is_published))

def get_all_blogs(published_only=False):
    """Get all blog posts"""
    if published_only:
        query = "SELECT * FROM blogs WHERE is_published = TRUE ORDER BY created_at DESC"
    else:
        query = "SELECT * FROM blogs ORDER BY created_at DESC"
    return execute_query(query, fetch_all=True)

def get_blog_by_id(blog_id):
    """Get a blog post by ID"""
    query = "SELECT * FROM blogs WHERE id = %s"
    return execute_query(query, (blog_id,), fetch_one=True)

def get_blog_by_slug(slug):
    """Get a blog post by slug"""
    query = "SELECT * FROM blogs WHERE slug = %s"
    return execute_query(query, (slug,), fetch_one=True)

def update_blog(blog_id, **kwargs):
    """Update a blog post"""
    fields = []
    values = []
    allowed_fields = ['title', 'slug', 'content', 'summary', 'image_url', 'author', 'is_published']
    for key, value in kwargs.items():
        if key in allowed_fields and value is not None:
            fields.append(f"{key} = %s")
            values.append(value)
    if fields:
        values.append(blog_id)
        query = f"UPDATE blogs SET {', '.join(fields)} WHERE id = %s"
        execute_query(query, tuple(values))
        return True
    return False

def delete_blog(blog_id):
    """Delete a blog post"""
    execute_query("DELETE FROM blogs WHERE id = %s", (blog_id,))
    return True
