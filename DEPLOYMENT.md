# Vercel Deployment Guide

This guide explains how to deploy RhythmicTunes to Vercel.

## Project Structure

- **Frontend**: React + TypeScript + Vite (root directory)
- **Backend**: Node.js + Express (in `/server` directory)
- **Database**: MongoDB Atlas (cloud-hosted)

## Frontend Deployment to Vercel

### 1. Connect Your Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository (rhythm-recommends)
4. Vercel will auto-detect your setup

### 2. Set Environment Variables in Vercel Dashboard

Go to **Settings → Environment Variables** and add:

```
VITE_API_URL=https://your-backend-url.com
```

Example values:
- **Development**: `http://localhost:5000`
- **Production**: `https://api.yourdomain.com` (or wherever your backend is hosted)

### 3. Deploy

Push to your main branch or manually trigger a deployment. Vercel will:
1. Run `npm run build`
2. Deploy the `dist/` folder

## Backend Deployment to Render.com

**This is the recommended approach for this project.**

### Step-by-Step Setup

#### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub (easier connection)

#### 2. Connect GitHub Repository
- Click "New +" → "Web Service"
- Select your GitHub repository (rhythm-recommends)
- Choose "Connect"

#### 3. Configure the Web Service

**Basic Info:**
- **Name**: `rhythmictunes-backend`
- **Region**: Choose closest to your users (e.g., US Oregon)
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Plan**: Free (or Starter if you need reliability)

#### 4. Add Environment Variables

In Render Dashboard → Environment section, add:

```
MONGODB_URI=mongodb+srv://anshshuklavg_db_user:dGFPT3t2PFthfjTT@cluster0.f0mn1yv.mongodb.net/rhythmictunes?retryWrites=true&w=majority
JWT_SECRET=rhythmictunes_super_secret_jwt_key_2024
NODE_ENV=production
PORT=5000
```

**Or copy from .env.render file** (already created in your repo)

#### 5. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy your backend
- You'll get a URL like: `https://rhythmictunes-backend.onrender.com`

#### 6. Connect Frontend

Update your **Vercel Dashboard** → Environment Variables:
```
VITE_API_URL=https://rhythmictunes-backend.onrender.com
```

### Testing Backend on Render

Once deployed, test these endpoints:

```bash
# Health check
curl https://rhythmictunes-backend.onrender.com/api/health

# Signup (test)
curl -X POST https://rhythmictunes-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Root endpoint
curl https://rhythmictunes-backend.onrender.com/
```

### Render Free Tier Notes

✅ **Included:**
- Deployments from GitHub
- SSL/TLS certificates
- Custom domain support
- 750 compute hours/month
- Automatic redeploy on git push

⚠️ **Limitations:**
- Services spin down after 15 mins of inactivity (cold start ~30s)
- Free tier databases not included (we use MongoDB Atlas - separate)

**Upgrade to Starter ($7/month) to:**
- Keep service always running (no cold starts)
- Get more compute hours

### Troubleshooting Render Deployment

#### Build Fails
- Check build logs in Render Dashboard
- Verify `/server/package.json` has all dependencies
- Try building locally: `cd server && npm install && node index.js`

#### Port Error
- Render automatically assigns PORT from env
- Backend code reads from `process.env.PORT || 5000` ✓

#### MongoDB Connection Error
- Verify `MONGODB_URI` is correct in Environment Variables
- Check MongoDB Atlas allows connections from Render IP
- Test connection locally with same URI

#### API Returns 403/404
- Check CORS is enabled in backend
- Verify frontend `VITE_API_URL` matches Render domain
- Restart service from Render Dashboard

### Monitoring

In Render Dashboard, you can:
- View **Logs** in real-time
- Check **Health** status
- Monitor **CPU/Memory** usage
- View **Deployment History**

---



## Environment Variables Checklist

### Frontend (.env in Vercel Dashboard)
- `VITE_API_URL` - URL of your backend API

### Backend (.env in your backend hosting)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Strong random string for JWT signing
- `PORT` - Server port (usually 5000 or set by platform)

## Testing After Deployment

1. **Frontend**: Visit your Vercel deployment URL
2. **Backend**: Test health endpoint: `https://your-backend/api/health`
3. **Auth**: Try signing up - it should call your backend API
4. **Playback**: Verify audio files load and play

## Important Notes

⚠️ **Never commit `.env` files** - Use `.env.example` as a template

✅ **MongoDB Atlas** is already set up with your cloud connection string

✅ **Audio URLs** are using SoundHelix CDN (works globally)

## Troubleshooting

### 403 Errors on API calls
- Check `VITE_API_URL` matches your backend URL
- Verify backend is running
- Check CORS settings in backend

### Build fails on Vercel
- Run `npm run build` locally to test
- Check that all dependencies are in `package.json`

### Backend not starting
- Verify `MONGODB_URI` is correct
- Check `JWT_SECRET` is set
- Review backend logs in your hosting platform

## Next Steps

1. Deploy frontend to Vercel
2. Deploy backend to Railway/Render
3. Update `VITE_API_URL` in Vercel with backend URL
4. Test end-to-end functionality
5. Monitor logs for any issues
