# Vehicle Rental System Backend API

A comprehensive RESTful API for managing a vehicle rental system built with Node.js, Express.js, TypeScript, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Running the Application](#running-the-application)
- [Author](#author)

## ✨ Features

- **User Management**: Registration, authentication, and profile management
- **Vehicle Management**: CRUD operations for vehicles (Admin only)
- **Booking System**: Create, view, and manage vehicle bookings
- **Role-Based Access Control**: Admin and Customer roles with different permissions
- **JWT Authentication**: Secure token-based authentication
- **Database Integration**: PostgreSQL with automatic table initialization

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Environment Configuration**: dotenv


## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/soumik-prime/vehicle-rental-system-backend-api.git
   cd vehicle-rental-system-backend-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) section)

4. **Ensure PostgreSQL is running**
   
   Make sure your PostgreSQL server is running and accessible

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
CONNECTION_STR=postgresql://username:password@localhost:5432/vehicle_rental_db
PORT=8080
JWT_SECRET=your_jwt_secret_key_here
```

**Configuration Details:**

- `CONNECTION_STR`: PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database_name`
- `PORT`: Server port (default: 8080)
- `JWT_SECRET`: Secret key for JWT token generation (use a strong, random string)

## 🗄 Database Schema

The application automatically creates three tables on initialization:

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    role VARCHAR(15)
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(150),
    type VARCHAR(15) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    daily_rent_price NUMERIC(10,2) NOT NULL,
    availability_status VARCHAR(15)
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE DEFAULT CURRENT_DATE,
    rent_end_date DATE NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    status VARCHAR(15) NOT NULL
);
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/signup` | Public | Register new user account |
| POST | `/api/v1/auth/signin` | Public | Login and receive JWT token |

**Signup Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```

**Signin Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Vehicles
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/vehicles` | Admin only | Add new vehicle with name, type, registration, daily rent price and availability status |
| GET | `/api/v1/vehicles` | Public | View all vehicles in the system |
| GET | `/api/v1/vehicles/:vehicleId` | Public | View specific vehicle details |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin only | Update vehicle details, daily rent price or availability status |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin only | Delete vehicle (only if no active bookings exist) |

**Create Vehicle Request Body:**
```json
{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

**Update Vehicle Request Body:**
```json
{
  "vehicle_name": "Toyota Camry 2024 Premium",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 55,
  "availability_status": "available"
}
```

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | Admin only | View all users in the system |
| PUT | `/api/v1/users/:userId` | Admin or Own | Admin: Update any user's role or details<br>Customer: Update own profile only |
| DELETE | `/api/v1/users/:userId` | Admin only | Delete user (only if no active bookings exist) |

**Update User Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567899",
  "role": "admin"
}
```

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/bookings` | Customer or Admin | Create booking with start/end dates<br>• Validates vehicle availability<br>• Calculates total price (daily rate × duration)<br>• Updates vehicle status to "booked" |
| GET | `/api/v1/bookings` | Role-based | Admin: View all bookings<br>Customer: View own bookings only |
| PUT | `/api/v1/bookings/:bookingId` | Role-based | Customer: Cancel booking (before start date only)<br>Admin: Mark as "returned" (updates vehicle to "available")<br>System: Auto-mark as "returned" when period ends |

**Create Booking Request Body:**
```json
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

**Request Body - Customer Cancellation**
```json
{
  "status": "cancelled"
}
```

**Request Body - Admin Mark as Returned**
```json
{
  "status": "returned"
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **Admin**: Full access to all resources
- **Customer**: Limited access to own bookings and profile

## 📁 Project Structure

```
vehicle-rental-system-backend-api/
├── src/
│   ├── app.ts                      # Express app configuration
│   ├── server.ts                   # Server entry point
│   ├── config/
│   │   ├── db.ts                   # Database configuration and initialization
│   │   └── env.ts                  # Environment variables configuration
│   ├── middlewares/
│   │   ├── auth.ts                 # JWT authentication middleware
│   │   ├── logger.ts               # Request logging middleware
│   │   └── ownerOrAdmin.ts         # Owner/Admin authorization middleware
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts  # Authentication controllers
│   │   │   ├── auth.routes.ts      # Authentication routes
│   │   │   └── auth.service.ts     # Authentication business logic
│   │   ├── bookings/
│   │   │   ├── bookings.controller.ts
│   │   │   ├── bookings.routes.ts
│   │   │   └── bookings.service.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.routes.ts
│   │   │   └── users.service.ts
│   │   └── vehicles/
│   │       ├── vehicles.controller.ts
│   │       ├── vehicles.routes.ts
│   │       └── vehicles.service.ts
│   └── types/
│       ├── auth/
│       │   └── enum.ts             # User role enums
│       └── express/
│           └── index.d.ts          # Express type extensions
├── package.json
├── tsconfig.json
└── README.md
```

## 🏃 Running the Application

### Development Mode

Start the development server with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:8080`

### Build for Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

### Run Production Build

After building, you can run the compiled code:

```bash
node dist/server.js
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### HTTP Status Codes Used
| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation errors, invalid input |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected server errors |


## 👨‍💻 Author

**Md. Samiul Islam Soumik**

- GitHub: [@soumik-prime](https://github.com/soumik-prime)
- Repository: [vehicle-rental-system-backend-api](https://github.com/soumik-prime/vehicle-rental-system-backend-api)
