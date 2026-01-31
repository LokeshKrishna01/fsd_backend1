# Access Revocation Management System

A full-stack access management system with JWT authentication, role-based access control (RBAC), and MongoDB persistence. This system ensures that once access is revoked by an admin, users cannot self-restore their access - a critical business requirement enforced through database-level validation.

## 🌟 Features

- **JWT Authentication** - Secure token-based authentication with real-time database validation
- **Role-Based Access Control** - Separate permissions for USER and ADMIN roles
- **Access Revocation Enforcement** - Revoked users are immediately blocked even with valid JWT tokens
- **Immutable Audit Logging** - Complete audit trail of all access changes
- **Modern UI** - Clean, responsive interface with gradient design
- **Database Persistence** - All access status stored in MongoDB Atlas

## 🚀 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database (MongoDB Atlas)
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 👥 User Roles & Permissions

### USER Role
- ✅ Register and login
- ✅ View own access status
- ❌ Cannot grant/revoke access
- ❌ Cannot view other users

### ADMIN Role
- ✅ Register and login
- ✅ View all users and their access status
- ✅ Grant access to users
- ✅ Revoke access from users
- ✅ View complete access history (audit logs)
- ❌ Cannot revoke own access

## 📡 API Endpoints

### Authentication (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "USER" // or "ADMIN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "email": "user@example.com",
    "role": "USER",
    "accessStatus": "active"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "user@example.com",
      "role": "USER",
      "accessStatus": "active"
    }
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Admin Endpoints (`/api/admin`)

All admin endpoints require `Authorization: Bearer {token}` header and ADMIN role.

#### Get All Users
```http
GET /api/admin/users
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "email": "user@example.com",
      "role": "USER",
      "accessStatus": "active",
      "createdAt": "2026-01-31T..."
    }
  ]
}
```

#### Grant Access
```http
POST /api/admin/grant-access
Content-Type: application/json

{
  "userId": "user_id_here",
  "reason": "Access restored after review"
}
```

#### Revoke Access
```http
POST /api/admin/revoke-access
Content-Type: application/json

{
  "userId": "user_id_here",
  "reason": "Policy violation"
}
```

#### Get Access History
```http
GET /api/admin/access-history
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "userId": "...",
      "userEmail": "user@example.com",
      "action": "revoked",
      "performedBy": "...",
      "performedByEmail": "admin@example.com",
      "reason": "Policy violation",
      "timestamp": "2026-01-31T..."
    }
  ]
}
```

### User Endpoints (`/api/user`)

#### Get Access Status
```http
GET /api/user/status
Authorization: Bearer {token}
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['USER', 'ADMIN'], default: 'USER'),
  accessStatus: String (enum: ['active', 'revoked'], default: 'active'),
  createdAt: Date
}
```

### AccessLogs Collection (Immutable)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  userEmail: String,
  action: String (enum: ['granted', 'revoked']),
  performedBy: ObjectId (ref: 'User'),
  performedByEmail: String,
  reason: String,
  timestamp: Date (immutable)
}
```

## 🔒 Security Features

1. **Password Hashing** - All passwords hashed with bcrypt (10 rounds)
2. **JWT Validation** - Every protected route validates JWT signature
3. **Database Validation** - Access status checked on every request (prevents revoked users from accessing even with valid tokens)
4. **Role-Based Access** - Middleware enforces role requirements
5. **Immutable Audit Logs** - Access logs cannot be modified or deleted
6. **Environment Variables** - Sensitive data stored in .env files

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (use `.env.example` as template):
   ```env
   MONGODB_URI=mongodb+srv://lokesh:01@fsd34.dltgubd.mongodb.net/access-management?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the server:
   ```bash
   npm start
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## 🌐 Deployment to Render

### Backend Deployment

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Configure Service**
   - **Name**: `access-revocation-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Add the following in Render dashboard:
   ```
   MONGODB_URI=mongodb+srv://lokesh:01@fsd34.dltgubd.mongodb.net/access-management?retryWrites=true&w=majority
   JWT_SECRET=your-production-secret-key-change-this
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the backend URL (e.g., `https://access-revocation-backend.onrender.com`)

### Frontend Deployment

1. **Update API URL**
   - Create `.env.production` in frontend directory:
     ```env
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

2. **Create New Static Site**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the `frontend` directory

3. **Configure Service**
   - **Name**: `access-revocation-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

5. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment
   - Your app will be live at `https://your-site-name.onrender.com`

## 🧪 Testing the Application

### Test User Registration
1. Open frontend URL
2. Click "Sign up here"
3. Register as ADMIN:
   - Email: `admin@test.com`
   - Password: `admin123`
   - Role: `ADMIN`
4. Register as USER:
   - Email: `user@test.com`
   - Password: `user123`
   - Role: `USER`

### Test Access Revocation
1. Login as ADMIN (`admin@test.com`)
2. View all users
3. Revoke access for `user@test.com`
4. Logout and try to login as `user@test.com`
5. Login should fail with "Access revoked" message

### Test Access Restoration
1. Login as ADMIN
2. Grant access back to `user@test.com`
3. Logout and login as `user@test.com`
4. Login should succeed

## 📝 Project Structure

```
project/
├── backend/
│   ├── models/
│   │   ├── User.js              # User model with authentication
│   │   └── AccessLog.js         # Immutable audit log model
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── roleCheck.js         # Role-based access control
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── admin.js             # Admin management endpoints
│   │   └── user.js              # User endpoints
│   ├── .env                     # Environment variables (not in git)
│   ├── .env.example             # Environment template
│   ├── server.js                # Express app entry point
│   ├── package.json             # Backend dependencies
│   └── render.yaml              # Render deployment config
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx        # Login page
    │   │   └── Signup.jsx       # Signup page
    │   ├── services/
    │   │   └── api.js           # API client with interceptors
    │   ├── styles/
    │   │   └── Auth.css         # Authentication styles
    │   ├── App.jsx              # Main app component
    │   └── index.css            # Global styles
    ├── .env                     # Environment variables (not in git)
    ├── .env.example             # Environment template
    └── package.json             # Frontend dependencies
```

## 🔗 Live Deployment Links

- **GitHub Repository**: [https://github.com/LokeshKrishna01/fsd_backend1](https://github.com/LokeshKrishna01/fsd_backend1)
- **Frontend**: `https://your-frontend.onrender.com` (Deploy following instructions above)
- **Backend API**: `https://your-backend.onrender.com` (Deploy following instructions above)

## ⚠️ Critical Business Rule

**Once access is revoked, users CANNOT self-restore their access.**

This is enforced through:
1. **Database-level tracking** - Access status stored in MongoDB
2. **Middleware validation** - Every API request checks current database status
3. **Token invalidation** - Valid JWTs are rejected if access is revoked
4. **ADMIN-only restoration** - Only ADMIN role can grant access

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created for Full Stack Development Assignment

---

**Note**: Remember to update the MongoDB connection string and JWT secret in production!
