# Smart Stadium - Single Service Cloud Run Deployment

This project is configured to deploy as **one Cloud Run service**:
- Express API (`/dashboard`, `/food`, `/emergency`)
- Frontend web app (served by the same Express server)

No separate frontend/backend deployment is needed.

## Files used for deployment

- `Dockerfile` (root): builds frontend, bundles it into backend, runs one server
- `.dockerignore` (root): keeps build context clean
- `cloudbuild.yaml` (root): builds single image with optional API URL build arg

## 1) One-time GCP setup

1. Login:
   - `gcloud auth login`
2. Select project:
   - `gcloud config set project YOUR_GCP_PROJECT_ID`
3. Enable required services:
   - `gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com`
4. Set region:
   - `gcloud config set run/region asia-south1`
5. Create Artifact Registry repository (one-time):
   - `gcloud artifacts repositories create stadium --repository-format=docker --location=asia-south1 --description="Stadium containers"`

## 2) Build one container image

Use same-origin API (recommended for single-service):

```bash
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=_IMAGE=asia-south1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/stadium/stadium-web:latest,_VITE_API_URL=
```

## 3) Deploy one Cloud Run service

```bash
gcloud run deploy stadium-web \
  --image asia-south1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/stadium/stadium-web:latest \
  --allow-unauthenticated \
  --region asia-south1 \
  --platform managed
```

## 4) Verify after deploy

From the same base URL:
- `/` loads the web app
- `/dashboard` returns live dashboard JSON
- `/food` returns food vendor JSON
- `POST /emergency` works
- `/api/health` returns `{ "status": "ok" }`

## 5) Local run (single service behavior)

1. Backend API local:
   - `cd backend`
   - `npm install`
   - `npm start`
2. Frontend local (dev):
   - `cd frontend`
   - `npm install`
   - `npm run dev`

For production parity, Cloud Run uses one container and serves frontend from backend static files.

## Security notes

- No personal data is hardcoded.
- No API keys/secrets/tokens are committed.
- `.env` files are gitignored.
- Keep sensitive values in Cloud Run environment variables if needed later.
