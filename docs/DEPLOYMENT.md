# ARAVALLI SENTINEL — Production Deployment Guide

---

## 1. Environment Checklist

Ensure the following variables are configured in production:

### Backend Environment Variables (`backend/.env`):
| Variable | Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Listening port | `5000` (or injected by Cloud Run) |
| `FRONTEND_URL` | Domain of production frontend for CORS | `https://aravalli-sentinel.web.app` |
| `GEMINI_API_KEY` | Google AI Studio API Key | `AIzaSy...` |
| `GEMINI_MODEL` | Official model name | `gemini-2.0-flash` |
| `FIREBASE_PROJECT_ID` | Firebase Project Identifier | `aravalli-sentinel` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Stringified JSON of service account credentials | `{"type":"service_account",...}` |
| `AUTHORITY_INVITE_SECRET` | Secret token for provisioning officer accounts | Long random 32-character string |

### Frontend Environment Variables (`frontend/.env`):
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API base URL | `https://api.aravalli-sentinel.org/api` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JS API key (optional) | `AIzaSy...` |

---

## 2. Deploying Backend to Google Cloud Run

Google Cloud Run provides a serverless, autoscaling, containerized environment ideal for Node.js:

1. Create a `Dockerfile` in `backend/`:
   ```dockerfile
   FROM node:24-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY src/ ./src/
   EXPOSE 5000
   CMD ["node", "src/server.js"]
   ```

2. Deploy using Google Cloud SDK:
   ```bash
   gcloud builds submit --tag gcr.io/aravalli-sentinel/backend
   gcloud run deploy aravalli-backend \
     --image gcr.io/aravalli-sentinel/backend \
     --platform managed \
     --region asia-south1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production,GEMINI_API_KEY=AIzaSy...
   ```

---

## 3. Deploying Frontend to Firebase Hosting

1. Build the production assets:
   ```powershell
   npm run build:frontend
   ```
2. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   - Public directory: `frontend/dist`
   - Single-page application: `Yes`
3. Deploy:
   ```bash
   firebase deploy --only hosting,firestore:rules,storage:rules
   ```

---

## 4. Production Security Recommendations

1. **HTTP Referrer Restrictions:** Restrict Google Maps API keys strictly to the production frontend domain (`https://*.aravalli-sentinel.web.app/*`).
2. **IP Whitelisting:** For authority registration endpoints, restrict access to state government Virtual Private Clouds or official IP gateways.
3. **Audit Immutability:** Enable Cloud Firestore Object Versioning and audit retention policies.
