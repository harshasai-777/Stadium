# Smart Stadium Deployment (Google Cloud Run)

This project is already split into:
- `backend` (Express API)
- `frontend` (Vite app)

## 0) One-time setup

1. Install Google Cloud SDK and login:
   - `gcloud auth login`
2. Set project:
   - `gcloud config set project YOUR_GCP_PROJECT_ID`
3. Enable APIs:
   - `gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com`
4. Set region (example):
   - `gcloud config set run/region asia-south1`
5. Create Artifact Registry repo (one-time):
   - `gcloud artifacts repositories create stadium --repository-format=docker --location=asia-south1 --description=\"Stadium containers\"`

## 1) Deploy backend to Cloud Run

Build backend image with Cloud Build:

```bash
gcloud builds submit \
  --config cloudbuild.backend.yaml \
  --substitutions=_IMAGE=asia-south1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/stadium/backend:latest
```

Deploy backend service:

```bash
gcloud run deploy stadium-backend \
  --image asia-south1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/stadium/backend:latest \
  --allow-unauthenticated \
  --region asia-south1 \
  --platform managed
```

Test backend:
- `https://<backend-service-url>/`
- `https://<backend-service-url>/dashboard`
- `https://<backend-service-url>/food`

## 2) Deploy frontend to Cloud Run

Use backend URL from step 1 as Vite API URL during build.

Build frontend image:

```bash
gcloud builds submit \
  --config cloudbuild.frontend.yaml \
  --substitutions=_IMAGE=asia-south1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/stadium/frontend:latest,_VITE_API_URL=https://<backend-service-url>
```

Deploy frontend service:

```bash
gcloud run deploy stadium-frontend \
  --image asia-south1-docker.pkg.dev/YOUR_GCP_PROJECT_ID/stadium/frontend:latest \
  --allow-unauthenticated \
  --region asia-south1 \
  --platform managed
```

Open frontend URL from deploy output.

## 3) Update flow (when code changes)

1. Rebuild + redeploy backend.
2. Rebuild + redeploy frontend with `_VITE_API_URL` pointing to backend URL.
3. Hard refresh browser (`Ctrl+F5`) if needed.

## 4) Local verification before deploy

Backend:
```bash
cd backend
npm install
npm start
```

Frontend:
```bash
cd frontend
npm install
npm run build
```

## Notes

- No database required.
- No secrets are embedded in code.
- `frontend/.env` can stay local-only for dev.
- In production, API URL is injected during frontend image build using `_VITE_API_URL`.
