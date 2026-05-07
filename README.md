# Inyou — Luxury Perfume E-Commerce

A full-stack luxury perfume e-commerce website built with **Next.js 16** (frontend) and **Flask + MySQL** (backend).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **MySQL** (via XAMPP, WAMP, or standalone)

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend will:
- Auto-create the database and tables if they don't exist
- Start on **http://localhost:8000**

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:3000**

---

## 🔐 Login Credentials

### Admin Login

| Field    | Value              |
|----------|--------------------|
| URL      | http://localhost:3000/login |
| Email    | `admin@inyou.luxury`   |
| Password | `Inyou@123`         |
| Admin Panel | http://localhost:3000/admin/dashboard |

### User Login

Users can register a new account at **http://localhost:3000/signup** with:
- First Name, Last Name
- Email
- Password

---

## 📁 Project Structure

```
ecommerce-clothing/
├── frontend/                 # Next.js 16 (React)
│   ├── app/                  # Pages & routes
│   ├── components/           # React components
│   │   ├── layout/           # Header, Footer
│   │   ├── home/             # Homepage sections
│   │   ├── admin/            # Admin panel components
│   │   ├── product/          # Product detail components
│   │   └── ui/               # Reusable UI (shadcn/ui)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # API client & utilities
│   ├── styles/               # Global CSS
│   ├── public/               # Static assets
│   ├── package.json
│   ├── next.config.mjs
│   └── .env.local            # Frontend environment variables
│
├── backend/                  # Flask + MySQL (Python)
│   ├── app.py                # Main application & API routes
│   ├── models.py             # Database models & operations
│   ├── database.py           # MySQL connection setup
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Backend environment variables
│
└── .gitignore
```

---

## 🛍️ Features

### Customer Facing
- Browse & search products by category
- Product detail pages with image galleries
- Shopping cart with size/color selection
- Razorpay payment integration
- Order tracking & history
- User account management (profile, addresses, wishlist)
- Responsive design for mobile & desktop

### Admin Panel (`/admin`)
- Dashboard with revenue & order stats
- Product management (CRUD with image upload via Cloudinary)
- Category management (parent/child categories)
- Order management & status updates
- Customer management
- Coupon codes & reviews
- Customizable hero banner, testimonials, and featured products

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_clothing_local
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/<id>` | Get single product |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/user/orders` | Get user's orders |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET/POST | `/api/admin/products` | List/Create products |
| PUT/DELETE | `/api/admin/products/<id>` | Update/Delete product |
| GET/PUT | `/api/admin/orders` | List/Update orders |
| GET | `/api/admin/customers` | List customers |
| GET/POST | `/api/admin/categories` | List/Create categories |
