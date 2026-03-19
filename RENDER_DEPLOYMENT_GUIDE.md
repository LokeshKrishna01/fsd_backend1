# Deploy to Render - Step-by-Step Guide

## 📋 Prerequisites
- ✅ GitHub repository created: https://github.com/LokeshKrishna01/fsd_backend1
- ✅ `render.yaml` file in root directory (already done)
- ✅ Render account (free) - Create at https://render.com/

---

## 🚀 Deployment Steps

### Step 1: Sign Up / Login to Render

1. Go to **https://render.com/**
2. Click **"Get Started for Free"** or **"Sign In"**
3. Sign up using:
   - GitHub account (recommended - easiest)
   - GitLab account
   - Email

### Step 2: Connect Your GitHub Account

1. After logging in, click **"Authorize Render"** to connect GitHub
2. Grant Render access to your repositories
3. You'll be redirected to the Render Dashboard

### Step 3: Deploy Using Blueprint

1. **Click the "New +" button** at the top right of the dashboard
2. Select **"Blueprint"** from the dropdown menu
3. **Connect Repository**:
   - Click "Connect account" if not already connected
   - Search for: `LokeshKrishna01/fsd_backend1`
   - Click **"Connect"** next to your repository
4. **Blueprint Configuration**:
   - Render will automatically detect the `render.yaml` file
   - You'll see a preview showing 2 services:
     * `access-backend` (Web Service)
     * `access-frontend` (Static Site)
5. **Click "Apply"**

### Step 4: Wait for Deployment

**What happens next:**
- Render creates both services automatically
- You'll see live build logs for each service
- Backend deployment: ~2-3 minutes
- Frontend deployment: ~2-3 minutes

**Monitor Progress:**
- You'll see real-time logs
- Green checkmark ✅ means successful deployment
- Red X ❌ means there's an error (check logs)

### Step 5: Access Your Deployed Application

Once deployment completes:

1. **Go to Dashboard**: https://dashboard.render.com/
2. **Find Your Services**:
   - Click on `access-frontend`
   - You'll see a URL like: `https://access-frontend.onrender.com`
3. **Click the URL** to open your live application

---

## 🎯 What Each Service Does

### Backend Service (`access-backend`)
- **Type**: Web Service
- **Runtime**: Node.js
- **URL**: `https://access-backend.onrender.com`
- **Environment Variables**: Automatically configured from `render.yaml`
- **MongoDB**: Connected to your Cluster0 database

### Frontend Service (`access-frontend`)
- **Type**: Static Site
- **Runtime**: Static HTML/CSS/JS
- **URL**: `https://access-frontend.onrender.com`
- **API Connection**: Automatically linked to backend

---

## ✅ Verify Deployment

### Test Your Application

1. **Open Frontend URL**: `https://access-frontend.onrender.com`
2. **Test Registration**:
   - Click "Sign up here"
   - Create an ADMIN account
   - Create a USER account
3. **Test Login**:
   - Login with your credentials
   - Should redirect based on role

### Check Backend API

1. **Test API Endpoint**:
   - Open: `https://access-backend.onrender.com`
   - Should see JSON response with API info
2. **Check Logs**:
   - Go to Render Dashboard → `access-backend`
   - Click "Logs" tab
   - Should see: ✅ MongoDB Connected

---

## 🔧 Common Issues & Solutions

### Issue 1: Build Failed
**Solution**: Check the logs for errors
- Missing dependencies? → Check package.json
- MongoDB connection? → Verify environment variables

### Issue 2: Frontend Shows Blank Page
**Solution**: 
- Check browser console for errors
- Verify API URL is correct in environment variables

### Issue 3: CORS Error
**Solution**:
- Backend environment variable `FRONTEND_URL` should match your frontend URL
- Update in Render Dashboard → `access-backend` → Environment

---

## 📝 Important Notes

### Free Tier Limitations
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes ~30 seconds
- ✅ Perfect for development/testing
- ✅ No credit card required

### Updating Your Deployment
After making code changes:
1. Push to GitHub: `git push`
2. Render auto-deploys (if auto-deploy enabled)
3. Or manually click "Deploy" in Render Dashboard

---

## 🎉 You're Done!

Your application is now live at:
- **Frontend**: `https://access-frontend.onrender.com`
- **Backend**: `https://access-backend.onrender.com`
- **GitHub**: https://github.com/LokeshKrishna01/fsd_backend1

Share these links in your assignment submission!

---

## 📞 Need Help?

If you encounter issues:
1. Check Render logs (Dashboard → Service → Logs)
2. Verify environment variables are set correctly
3. Check GitHub repository has latest code
4. Restart services if needed (Manual Deploy button)
