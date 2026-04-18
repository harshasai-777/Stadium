# Smart Stadium Deployment Guide

## 1) Pre-check (local)

1. Backend:
   - `cd backend`
   - `npm install`
   - `npm start`
   - Verify:
     - `http://localhost:5000/`
     - `http://localhost:5000/dashboard`
     - `http://localhost:5000/food`
2. Frontend:
   - `cd frontend`
   - `npm install`
   - Ensure `.env` has `VITE_API_URL=http://localhost:5000`
   - `npm run build`

## 2) Deploy Backend (Render)

1. Push latest code to GitHub/GitLab.
2. In Render, create a Web Service from the repo.
3. Use:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Deploy.
5. Copy backend URL, for example:
   - `https://your-backend.onrender.com`
6. Test:
   - `https://your-backend.onrender.com/`
   - `https://your-backend.onrender.com/dashboard`
   - `https://your-backend.onrender.com/food`

Note: `render.yaml` is included in repo to keep this configuration consistent.

## 3) Deploy Frontend (Vercel)

1. Import the same repo in Vercel.
2. Set:
   - Root Directory: `frontend`
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variable in Vercel project:
   - `VITE_API_URL=https://your-backend.onrender.com`
4. Deploy.

Note: `frontend/vercel.json` is included to keep build/output/SPA routing stable.

## 4) Post-deploy check

1. Open frontend URL.
2. Verify live updates every 5 seconds on dashboard/food.
3. Verify emergency request works.
4. If old data appears:
   - redeploy backend first, then frontend
   - hard refresh browser (`Ctrl + F5`)
