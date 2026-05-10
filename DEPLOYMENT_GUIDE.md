# Final Step: Link Your Frontend and Backend

Since you have already deployed them separately, follow these steps to make them talk to each other:

## 1. Get Your URLs
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Copy the **Backend URL** (e.g., `https://access-management-backend.onrender.com`).
3. Copy the **Frontend URL** (e.g., `https://access-management-frontend.onrender.com`).

## 2. Configure Backend (CORS)
1. In the Render Dashboard, click on your **Backend** service.
2. Go to **Environment**.
3. Add a new variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-frontend-url.onrender.com` (Paste your frontend URL here).
4. Click **Save Changes**.

## 3. Configure Frontend (API Link)
1. In the Render Dashboard, click on your **Frontend** service.
2. Go to **Environment**.
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (Paste your backend URL here).
   - *Note: My code now automatically adds the `/api` part, so just the base URL is fine!*
4. Click **Save Changes**.

## 4. Re-deploy
1. Both services should automatically start a "Manual Deploy" or "Auto-deploy" once you save the environment variables.
2. Once they are "Live", access your website using the **Frontend URL**.

---

### Which link to use?
Always use the **Frontend URL** to access your website. The backend URL is only for the frontend to talk to; users don't need to visit it directly.
