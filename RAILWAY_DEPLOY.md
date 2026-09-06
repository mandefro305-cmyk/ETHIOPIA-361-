# 🚂 How to Deploy Ethiopia 361° to Railway

This guide provides step-by-step instructions for deploying the **Ethiopia 361° Tourism Website** to [Railway](https://railway.com/).

---

## 📋 Prerequisites

1. A [Railway Account](https://railway.com/)
2. A [GitHub Account](https://github.com/) with your repository pushed
3. A MongoDB instance (either via **MongoDB Atlas** or **Railway's MongoDB Service**)

---

## 🛠️ Step-by-Step Deployment Options

### Method 1: Deploy via GitHub Integration (Recommended)

1. **Log in to Railway**
   - Go to [railway.com](https://railway.com/) and sign in with GitHub.

2. **Create a New Project**
   - Click **"New Project"**.
   - Select **"Deploy from GitHub repo"**.
   - Select your `ETHIOPIA-361-` repository.

3. **Configure Environment Variables**
   - In your Railway project, click on your deployed service and go to the **Variables** tab.
   - Click **"Raw Editor"** or add the following keys manually:

     | Variable Name | Example / Value | Description |
     | :--- | :--- | :--- |
     | `PORT` | `3000` | Railway automatically assigns a port, but setting `3000` is good practice. |
     | `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster0.2pqdkpd.mongodb.net/?appName=Cluster0` | MongoDB connection string (Atlas or Railway MongoDB). |
     | `SESSION_SECRET` | `ethiopia-tourism-secret-key-change-in-prod` | Secret key used for session signing. |
     | `ADMIN_PASSWORD` | `your_admin_password` | Default admin login password. |
     | `UPLOAD_DIR` | `/app/public/uploads` | Path for persistent volume upload storage. |
     | `GROQ_API_KEY` | `gsk_...` | (Optional) API key for Groq AI chat feature. |
     | `OPENROUTER_API_KEY` | `sk-or-...` | (Optional) API key for OpenRouter AI vision/chat feature. |
     | `EMAIL_USER` | `your-email@gmail.com` | (Optional) Email address for contact form submissions. |
     | `EMAIL_PASS` | `your-app-password` | (Optional) Email password / App Password. |

4. **Attach a Persistent Volume (For Media Uploads)**
   - Applications hosted on container platforms like Railway use ephemeral disks by default. To retain uploaded images, videos, and PDFs across deployments and restarts:
   - Go to your service settings in Railway.
   - Click **"Volumes"** -> **"Add Volume"**.
   - Set the mount path to `/app/public/uploads`.
   - Set the `UPLOAD_DIR` environment variable to `/app/public/uploads`.

5. **Generate a Public Domain**
   - Go to the **Settings** tab of your service in Railway.
   - Under **Networking** -> **Public Networking**, click **"Generate Domain"**.
   - Your application will now be live on a `.up.railway.app` URL (e.g., `https://ethiopia-361-production.up.railway.app`).

---

### Method 2: Provision MongoDB Database directly on Railway

If you prefer to host your MongoDB database directly on Railway instead of MongoDB Atlas:

1. In your Railway project canvas, click **"+ New"**.
2. Select **"Database"** -> **"MongoDB"**.
3. Once created, click on the MongoDB service and go to the **Variables** tab.
4. Copy the `MONGO_URL` or `MONGO_PRIVATE_URL`.
5. Go to your application service -> **Variables** tab.
6. Reference or set `MONGODB_URI` to `${{ MongoDB.MONGO_URL }}`.

---

### Method 3: Deploy via Railway CLI

If you prefer deploying directly from your local terminal:

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Log in:**
   ```bash
   railway login
   ```

3. **Link or Create Project:**
   ```bash
   railway init
   ```

4. **Set Environment Variables:**
   ```bash
   railway variables set MONGODB_URI="your_mongodb_connection_string"
   railway variables set SESSION_SECRET="your_session_secret"
   railway variables set UPLOAD_DIR="/app/public/uploads"
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

---

## ⚙️ Railway Configuration Files Included

The repository contains the necessary configuration files for Railway deployment:

- **`Procfile`**:
  ```
  web: node server-mongodb.js
  ```
- **`railway.json`**:
  ```json
  {
    "$schema": "https://railway.com/railway.schema.json",
    "build": {
      "builder": "NIXPACKS"
    },
    "deploy": {
      "startCommand": "node server-mongodb.js",
      "restartPolicyType": "ON_FAILURE",
      "restartPolicyMaxRetries": 10
    }
  }
  ```

---

## 🔍 Verification & Health Check

After deployment completes:
1. Visit your public Railway URL.
2. Verify home page, photo galleries, and AI chat assistant.
3. Access `/login` to log into the Admin Dashboard (`admin` / password set in env or DB).
4. Try uploading a sample place with image/video to confirm persistent volume (`UPLOAD_DIR`) storage works properly.
