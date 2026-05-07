#!/usr/bin/env python3
"""Test Razorpay connection"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load from explicit path
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

key_id = os.getenv('RAZORPAY_KEY_ID')
key_secret = os.getenv('RAZORPAY_KEY_SECRET')

print(f"KEY_ID: {key_id}")
print(f"KEY_SECRET: {key_secret[:5] if key_secret else None}...")

import razorpay
client = razorpay.Client(auth=(key_id, key_secret))

try:
    order = client.order.create({
        'amount': 10000,  # 100 INR in paise
        'currency': 'INR',
        'receipt': 'test_order_1'
    })
    print("SUCCESS! Order created:")
    print(order)
except Exception as e:
    print(f"ERROR: {e}")
