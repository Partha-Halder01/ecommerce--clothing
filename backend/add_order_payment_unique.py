"""Migration: stop one payment being used for more than one order."""
from database import execute_query

def migrate():
    try:
        execute_query("ALTER TABLE orders ADD UNIQUE INDEX uniq_orders_payment_id (payment_id)")
        print("Added unique index on orders.payment_id")
    except Exception as e:
        if "Duplicate key name" in str(e):
            print("Unique index already exists")
        else:
            raise

if __name__ == "__main__":
    migrate()
    print("Migration complete.")
