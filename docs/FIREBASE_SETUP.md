# ARAVALLI SENTINEL — Firebase Setup & Security Configuration

The platform is designed with a **High-Fidelity Dual-Mode Architecture**:
- **Offline / Local Demo Mode:** Runs out-of-the-box with zero credentials using the built-in local store.
- **Production Firebase Mode:** Fully integrates with Firebase Authentication, Cloud Firestore, and Firebase Storage.

---

## 1. Creating a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `aravalli-sentinel`.
3. Disable or enable Google Analytics according to your preference.
4. Once created, click **Continue**.

---

## 2. Setting Up Cloud Firestore

1. In the Firebase Console left sidebar, click **Build** → **Firestore Database**.
2. Click **Create Database**.
3. Select a database location (recommended: `asia-south1` for Mumbai, India or closest region).
4. Start in **Production mode**.
5. Copy the contents of `firestore.rules` from the project root into the **Rules** tab in the Firebase Console and click **Publish**.

---

## 3. Setting Up Firebase Storage

1. In the Firebase Console sidebar, click **Build** → **Storage**.
2. Click **Get Started**.
3. Select your bucket location (`asia-south1`).
4. Copy the contents of `storage.rules` from the project root into the **Rules** tab and click **Publish**.

---

## 4. Obtaining the Service Account Key (Backend)

The backend uses the Firebase Admin SDK to verify user JWTs, access Firestore, and upload evidence images:

1. In Firebase Console, click the **Gear Icon** (Project Settings) → **Service accounts** tab.
2. Under "Firebase Admin SDK", select **Node.js**.
3. Click **Generate new private key** and confirm.
4. Save the downloaded JSON file as `serviceAccountKey.json` inside `backend/config/` (or any secure path).
5. Open `backend/.env` and configure:
   ```env
   FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
   FIREBASE_PROJECT_ID=your-project-id
   ```
   *(Note: Never commit `serviceAccountKey.json` to git repository! It is excluded by `.gitignore`.)*

---

## 5. Web Client Configuration (Frontend - Optional)

If you wish to enable client-side Firebase Auth directly:
1. In Project Settings → **General**, scroll to "Your apps" and click the **Web icon** (`</>`).
2. Register app name: `Aravalli Sentinel Web`.
3. Copy the configuration object and set the variables in `frontend/.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=aravalli-sentinel.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=aravalli-sentinel
   VITE_FIREBASE_STORAGE_BUCKET=aravalli-sentinel.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
