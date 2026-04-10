# 🌿 EcoShare – Campus Carpooling & Bike Sharing System

A full-stack MERN application enabling students and faculty to share carpool rides and rent campus bikes, promoting greener, smarter campus commuting.

---

## 📂 Folder Structure

```
EcoShare/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, Me
│   │   ├── rideController.js  # CRUD for rides + booking
│   │   ├── bikeController.js  # Rent, Return, Stations
│   │   ├── bookingController.js # History
│   │   └── adminController.js # Admin management
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + adminOnly
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Ride.js            # Ride schema
│   │   ├── Bike.js            # Bike station schema
│   │   └── Booking.js         # Booking schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── rideRoutes.js
│   │   ├── bikeRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── seed.js                # DB seeder with sample data
│   ├── server.js              # Express app entry point
│   └── .env                   # Environment variables
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js       # Axios instance + interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── RideCard.jsx
    │   │   └── BikeStationCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── RideSearch.jsx
    │   │   ├── OfferRide.jsx
    │   │   ├── BikeRental.jsx
    │   │   ├── RideHistory.jsx
    │   │   └── AdminPanel.jsx
    │   ├── App.jsx            # Router setup
    │   ├── main.jsx           # React root
    │   └── index.css          # Global design system
    ├── index.html
    └── vite.config.js
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on port 27017)

---

## 🚀 Setup Instructions

### 1. Clone / Navigate to project

```bash
cd EcoShare
```

### 2. Configure Backend

```bash
cd backend
# Edit .env if needed:
# MONGO_URI=mongodb://localhost:27017/ecoshare
# JWT_SECRET=ecoshare_super_secret_jwt_key_2024
# PORT=5000
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Seed the Database (optional but recommended)

```bash
# Make sure MongoDB is running first!
node seed.js
```

Sample accounts created:
| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@ecoshare.com     | password123 |
| User  | aditya@campus.edu      | password123 |
| User  | priya@campus.edu       | password123 |

### 5. Start the Backend

```bash
npm run dev   # Nodemon (auto-restart on changes)
# or
npm start     # Production start
```

Backend runs at: `http://localhost:5000`

### 6. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 7. Start the Frontend

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint               | Auth | Description          |
|--------|------------------------|------|----------------------|
| POST   | `/api/auth/register`   | ❌   | Register user        |
| POST   | `/api/auth/login`      | ❌   | Login + get token    |
| GET    | `/api/auth/me`         | ✅   | Get my profile       |

### Rides
| Method | Endpoint               | Auth | Description          |
|--------|------------------------|------|----------------------|
| POST   | `/api/rides/create`    | ✅   | Offer a ride         |
| GET    | `/api/rides/search`    | ✅   | Search with filters  |
| POST   | `/api/rides/book/:id`  | ✅   | Book a ride          |
| GET    | `/api/rides/my-rides`  | ✅   | My offered rides     |
| GET    | `/api/rides/:id`       | ✅   | Get ride by ID       |

### Bikes
| Method | Endpoint                    | Auth | Description         |
|--------|-----------------------------|------|---------------------|
| GET    | `/api/bikes`                | ✅   | All stations        |
| GET    | `/api/bikes/active-rental`  | ✅   | My active rental    |
| POST   | `/api/bikes/rent`           | ✅   | Rent a bike         |
| POST   | `/api/bikes/return`         | ✅   | Return a bike       |

### Bookings
| Method | Endpoint                  | Auth | Description         |
|--------|---------------------------|------|---------------------|
| GET    | `/api/bookings/history`   | ✅   | My booking history  |

### Admin (Admin only)
| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| GET    | `/api/admin/stats`    | Platform statistics     |
| GET    | `/api/admin/users`    | All users               |
| DELETE | `/api/admin/users/:id`| Delete user             |
| GET    | `/api/admin/rides`    | All rides               |
| GET    | `/api/admin/bikes`    | All bike stations       |
| POST   | `/api/admin/bikes`    | Add bike station        |
| PUT    | `/api/admin/bikes/:id`| Update station          |
| DELETE | `/api/admin/bikes/:id`| Remove station          |
| GET    | `/api/admin/bookings` | All bookings            |

---

## 🌐 Frontend Pages

| Page           | Route         | Description                        |
|----------------|---------------|------------------------------------|
| Login          | `/login`      | JWT login form                     |
| Register       | `/register`   | Create a new account               |
| Dashboard      | `/dashboard`  | Stats, active rental, quick links  |
| Find Rides     | `/rides`      | Search + book carpool rides        |
| Offer Ride     | `/offer-ride` | Post a new ride                    |
| Bike Rental    | `/bikes`      | View stations, rent/return bikes   |
| My History     | `/history`    | All past bookings                  |
| Admin Panel    | `/admin`      | Admin-only management dashboard    |

---

## 🔐 Security Notes

- Passwords are hashed with **bcryptjs** (salt rounds: 10)
- JWTs expire in **7 days**
- Admin routes are double-protected (`protect` + `adminOnly`)
- 401 responses auto-logout the frontend user

---

## 🧪 Testing with Postman

1. **Register**: `POST /api/auth/register` with `{ name, email, password }`
2. **Login**: `POST /api/auth/login` → copy the `token`
3. Set `Authorization: Bearer <token>` header on all protected requests
4. Test rides, bikes, and admin endpoints

---

## 🌱 Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Frontend    | React 18 + Vite + Tailwind CSS |
| Backend     | Node.js + Express.js    |
| Database    | MongoDB + Mongoose      |
| Auth        | JWT + bcryptjs          |
| HTTP Client | Axios                   |
| UI Toasts   | react-hot-toast         |
| Icons/UX    | lucide-react + CSS animations |

---

## 🌿 Made with love for a greener campus!
