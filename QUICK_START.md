# Quick Start Guide - Run Project Locally

## Current Issue
MongoDB Atlas authentication is failing with credentials: `lokesh:01`

## Solutions to Get Running

### Option 1: Fix MongoDB Atlas (Recommended for Production)

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/

2. **Check Database User**:
   - Navigate to: Security → Database Access
   - Verify user "lokesh" exists
   - If password is not "01", note the correct password
   - Or create a new user with a known password

3. **Whitelist IP Address**:
   - Navigate to: Security → Network Access
   - Add your current IP OR add `0.0.0.0/0` (allows all - for development only)
   - Click "Confirm"

4. **Get Connection String**:
   - Navigate to: Deployment → Database
   - Click "Connect" on your cluster `fsd34`
   - Choose "Connect your application"
   - Copy the connection string
   - It should look like: `mongodb+srv://USERNAME:PASSWORD@fsd34.dltgubd.mongodb.net/?retryWrites=true&w=majority`

5. **Update Backend .env**:
   ```env
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@fsd34.dltgubd.mongodb.net/access-management?retryWrites=true&w=majority&appName=fsd34
   ```
   Replace USERNAME and PASSWORD with your actual credentials

### Option 2: Use MongoDB Atlas Free Tier (Fresh Start)

If you don't have access to the existing database:

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register
2. Create a new FREE cluster (M0)
3. Create a database user (e.g., `admin` / `password123`)
4. Whitelist all IPs: `0.0.0.0/0`
5. Get connection string and update `backend/.env`

### Option 3: Quick Test with Alternative Service

You can quickly test with MongoDB's public test database or create a free database at:
- **MongoDB Atlas** (recommended): https://www.mongodb.com/cloud/atlas
- **Clever Cloud**: https://www.clever-cloud.com/mongodb-hosting/

## After Fixing MongoDB Connection

### Step 1: Start Backend
```bash
cd backend
node server.js
```

**Expected Output**:
```
🚀 Server running on port 5000
📝 Environment: development
✅ MongoDB Connected: fsd34-xxx.mongodb.net
```

### Step 2: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

**Expected Output**:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Test the Application

1. **Open Browser**: http://localhost:5173
2. **Sign Up as Admin**:
   - Email: `admin@test.com`
   - Password: `admin123`
   - Role: ADMIN
3. **Sign Up as User**:
   - Email: `user@test.com`
   - Password: `user123`
   - Role: USER

### Step 4: Test Access Revocation

1. Login as ADMIN
2. View all users
3. Revoke access for the USER
4. Try to login as USER → Should be blocked
5. Grant access back → USER can login again

## Need Help?

If you're still stuck, please provide:
1. Do you have access to the MongoDB Atlas account?
2. Can you create a new MongoDB Atlas account?
3. Or would you prefer to use a different database solution?

I can help you set up any of these options!
