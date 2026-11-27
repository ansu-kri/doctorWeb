<p align="center">
  <img src="./assets/banner.png" alt="Doctor App Banner" width="100%" />
</p>

<h1 align="center">🏥 Doctor Appointment & Healthcare Management System</h1>

<p align="center">
  A Modern Full-Stack Healthcare Platform built with React, Redux Toolkit, Node.js & MongoDB
</p>

This platform enables patients to securely authenticate, book appointments, and manage healthcare interactions, while providing scalable backend architecture for real-world deployment.

🚀 Live Features
🔐 Authentication System

Email + OTP Login

Google OAuth Login

Secure JWT-based authentication

Redux Toolkit state management

Protected routes

👨‍⚕️ Patient Features

Register / Login

Book doctor appointments

View appointment history

Responsive mobile-first design

🩺 Doctor Features (Scalable Module)

Doctor profile management

Availability scheduling

Appointment tracking

🛠 Backend Features

RESTful API architecture

MVC folder structure

Profile image uploads use the backend Cloudinary configuration. New uploads are
validated in memory and stored as Cloudinary URLs with their `public_id`;
Cloudinary credentials must remain in the backend environment and must never be
copied into frontend variables.

Existing images in `backend/uploads` are retained and served read-only for
backward compatibility. The migration preview checks both legacy user and
doctor profile references. Preview the legacy image migration first by running
`node scripts/migrate-profile-images.js` from `backend`. After reviewing the
counts, run `node scripts/migrate-profile-images.js --apply` to upload eligible
images and update references. The script does not delete local files; remove
them only after the migrated records and deployed image URLs have been verified
and backed up.

Environment-based configuration

MongoDB integration

Error handling middleware

🏗 Tech Stack
Frontend

⚛ React (Vite)

🧠 Redux Toolkit (State Management)

🎨 Tailwind CSS (Modern UI)

🔐 Firebase Google Authentication

📦 Axios (API handling)

🌐 React Router DOM

Frontend Setup
cd frontend
npm install
npm run dev

Backend

🟢 Node.js

🚀 Express.js

🍃 MongoDB + Mongoose

🔐 JWT Authentication

📁 Multer (File Uploads)

🔑 dotenv (Environment variables)

 Backend Setup
cd backend
npm install
npm run dev

## Docker deployment

The backend uses the existing `MONGO_URL` Atlas connection string; Compose does
not start a MongoDB container. Uploads are stored in Cloudinary. The backend
service is only exposed inside the Compose network, and Nginx serves the
frontend while proxying `/api` and legacy `/uploads` requests to it.

On Windows PowerShell, create a private Compose environment file and populate
it with the existing backend settings:

```powershell
Copy-Item .env.example .env
notepad .env
```

Set `MONGO_URL`, `JWT_SECRET`, and the three backend Cloudinary values. Keep
`.env` private and never use `VITE_` variables for secrets. For local access,
keep `FRONTEND_URL=http://localhost:8080` and `FRONTEND_PORT=8080`.

Build and start both containers:

```powershell
docker compose up --build -d
docker compose ps
```

Verify the served frontend and proxied backend health endpoint with real HTTP
requests:

```powershell
(Invoke-WebRequest -UseBasicParsing http://localhost:8080).StatusCode
(Invoke-WebRequest -UseBasicParsing http://localhost:8080/api/health).Content
```

View container logs (press `Ctrl+C` to stop following them):

```powershell
docker compose logs -f backend frontend
```

Stop and remove the containers:

```powershell
docker compose down
```

Both services have health checks and `unless-stopped` restart policies. The
backend image includes the existing legacy `uploads` assets read-only; new
images are stored in Cloudinary, so no local upload volume or MongoDB volume is
required.