# Quick Render Deployment Checklist

## Before You Deploy

- [ ] Backend builds locally: `cd server && npm install && node index.js`
- [ ] MongoDB URI is accessible
- [ ] JWT_SECRET is set
- [ ] `.env` file is NOT committed (check `.gitignore`)

## Render Deployment Steps

### 1. Go to render.com
- Sign in with GitHub

### 2. Create Web Service
- Click "New +" → "Web Service"
- Connect GitHub repo: `rhythm-recommends`

### 3. Configure Service

| Setting | Value |
|---------|-------|
| **Name** | `rhythmictunes-backend` |
| **Region** | Oregon (or closest) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `cd server && npm install` |
| **Start Command** | `cd server && npm start` |
| **Plan** | Free (or Starter) |

### 4. Add Environment Variables

Click "Advanced" → "Add Environment Variable"

```
MONGODB_URI = mongodb+srv://anshshuklavg_db_user:dGFPT3t2PFthfjTT@cluster0.f0mn1yv.mongodb.net/rhythmictunes?retryWrites=true&w=majority

JWT_SECRET = rhythmictunes_super_secret_jwt_key_2024

NODE_ENV = production

PORT = 5000
```

### 5. Deploy
Click "Create Web Service" → Render builds and deploys

**Your backend URL:** `https://rhythmictunes-backend.onrender.com`

## Update Frontend (Vercel)

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add:
```
VITE_API_URL = https://rhythmictunes-backend.onrender.com
```

Then redeploy on Vercel.

## Test It

```bash
# Test health endpoint
curl https://rhythmictunes-backend.onrender.com/api/health
# Should return: {"status":"ok"}

# Test root
curl https://rhythmictunes-backend.onrender.com/
# Should return: {"status":"ok","message":"Backend API is running",...}
```

## Issues?

| Issue | Solution |
|-------|----------|
| **Build fails** | Check `/server/package.json` has all dependencies |
| **MongoDB error** | Verify `MONGODB_URI` in Render env vars |
| **Cold start slow** | Normal on free tier (~30s first request) |
| **Port error** | Backend correctly reads `process.env.PORT` |
| **CORS error** | Backend has `cors({ origin: true })` enabled |

---

**Your app is now live!** 🚀
- Frontend: `https://your-app.vercel.app`
- Backend: `https://rhythmictunes-backend.onrender.com`
- Database: MongoDB Atlas (already configured)
