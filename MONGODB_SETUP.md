# MongoDB Connection Issue - Action Required

## Problem
The MongoDB connection is failing with "bad auth: authentication failed" error.

## Possible Causes
1. **Incorrect Password**: The password "01" might not be correct for user "lokesh"
2. **User Not Created**: Database user "lokesh" might not exist in MongoDB Atlas
3. **IP Whitelist**: Your current IP address might not be whitelisted in MongoDB Atlas

## Solutions

### Option 1: Verify MongoDB Atlas Credentials (Recommended)

1. **Login to MongoDB Atlas**
   - Go to https://cloud.mongodb.com/
   - Login to your account

2. **Check Database User**
   - Click on "Database Access" in left sidebar
   - Verify user "lokesh" exists
   - If not, create a new user:
     * Click "Add New Database User"
     * Username: `lokesh`
     * Password: Choose authentication method (Password or Certificate)
     * Set user privileges (Atlas Admin or Read/Write to specific database)
     * Save

3. **Get Correct Connection String**
   - Click on "Database" in left sidebar
   - Click "Connect" on your cluster (fsd34)
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `access-management`

4. **Whitelist Your IP**
   - Click on "Network Access" in left sidebar
   - Click "Add IP Address"
   - Either add your current IP or click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Update .env File**
   ```env
   MONGODB_URI=your-correct-connection-string-here
   ```

### Option 2: Create New MongoDB Atlas Project

1. Create a fresh MongoDB Atlas cluster
2. Create a database user with a simple password (e.g., "password123")
3. Whitelist all IPs (0.0.0.0/0)
4. Get the connection string
5. Update `.env` file

### Option 3: Use Local MongoDB (For testing only)

If you have MongoDB installed locally:

```env
MONGODB_URI=mongodb://localhost:27017/access-management
```

## Current Connection String
```
mongodb+srv://lokesh:01@fsd34.dltgubd.mongodb.net/access-management?retryWrites=true&w=majority&appName=fsd34
```

## Next Steps

Once you've updated the MongoDB credentials:

1. Update `backend/.env` file with correct connection string
2. Run: `cd backend && node server.js`
3. You should see: "✅ MongoDB Connected"

## Need Help?

Please provide:
1. The correct MongoDB connection string (with password masked as `<password>`)
2. Or let me know if you'd like to use a different database setup
