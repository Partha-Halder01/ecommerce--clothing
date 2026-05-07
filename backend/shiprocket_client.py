import os
import time
import requests
from typing import Dict, Any, Optional

API_BASE = "https://apiv2.shiprocket.in/v1/external"

class ShiprocketClient:
    def __init__(self):
        self.email = os.getenv("SHIPROCKET_EMAIL", "")
        # Fallback to legacy env var name if provided
        self.password = os.getenv("SHIPROCKET_PASSWORD", os.getenv("Shiprocket", ""))
        self.token: Optional[str] = None
        self.token_expiry: float = 0.0

    def _login(self) -> str:
        if not self.email or not self.password:
            raise RuntimeError("Shiprocket credentials missing: set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env")
        url = f"{API_BASE}/auth/login"
        resp = requests.post(url, json={"email": self.email, "password": self.password}, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        token = data.get("token")
        if not token:
            raise RuntimeError("Shiprocket login failed: token not returned")
        # Token TTL is ~10 minutes documented; set conservative 8 minutes
        self.token = token
        self.token_expiry = time.time() + 8 * 60
        return token

    def _get_token(self) -> str:
        if self.token and time.time() < self.token_expiry:
            return self.token
        return self._login()

    def _headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self._get_token()}"}

    def serviceability(self, pickup_postcode: str, delivery_postcode: str, weight: float, cod: int = 0) -> Dict[str, Any]:
        """
        Check available courier companies and estimates.
        """
        url = f"{API_BASE}/courier/serviceability"
        params = {
            "pickup_postcode": pickup_postcode,
            "delivery_postcode": delivery_postcode,
            "cod": cod,
            "weight": weight,
        }
        resp = requests.get(url, headers=self._headers(), params=params, timeout=20)
        resp.raise_for_status()
        return resp.json()

    def track(self, awb: str) -> Dict[str, Any]:
        """
        Track shipment by AWB
        """
        url = f"{API_BASE}/courier/track/awb/{awb}"
        resp = requests.get(url, headers=self._headers(), timeout=20)
        resp.raise_for_status()
        return resp.json()

    def estimate(self, pickup_postcode: str, delivery_postcode: str, weight: float) -> Dict[str, Any]:
        """
        Get rate estimates (uses serviceability as primary source)
        """
        return self.serviceability(pickup_postcode, delivery_postcode, weight, cod=0)

    def create_order(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{API_BASE}/orders/create"
        resp = requests.post(url, headers=self._headers(), json=payload, timeout=30)
        resp.raise_for_status()
        return resp.json()

    def cancel_order(self, sr_order_id: int) -> Dict[str, Any]:
        url = f"{API_BASE}/orders/cancel"
        resp = requests.post(url, headers=self._headers(), json={"ids": [sr_order_id]}, timeout=15)
        resp.raise_for_status()
        return resp.json()
client = ShiprocketClient()
