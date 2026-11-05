"""Migration: add `max_order_amount` to coupons (coupon stops working above this order value)."""
from database import execute_query

def migrate():
    try:
        execute_query("ALTER TABLE coupons ADD COLUMN max_order_amount DECIMAL(10, 2) DEFAULT NULL AFTER min_order_amount")
        print("Added max_order_amount column to coupons table")
    except Exception as e:
        if "Duplicate column" in str(e):
            print("max_order_amount column already exists")
        else:
            raise

if __name__ == "__main__":
    migrate()
    print("Migration complete.")
