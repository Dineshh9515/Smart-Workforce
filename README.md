# Smart Workforce & Asset Availability Management System

A complete end-to-end MERN stack application for managing workforce availability, asset status, and intelligent job assignments.

## Features

- **Technician Management**: Track skills, certifications, and real-time availability status.
- **Asset Management**: Monitor asset health, location, and maintenance history.
- **Job Management**: Create and assign jobs with intelligent technician suggestions based on skills, location, and availability.
- **Availability Tracking**: Visual calendar/list views of workforce shifts and time-off.
- **Dashboard**: Real-time overview of system metrics and critical alerts.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local instance or Atlas connection string)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - The `.env` file is already created with default values.
   - Default Port: 5000
   - Default MongoDB URI: `mongodb://localhost:27017/smart_workforce_db`

4. Seed the Database (Optional but Recommended):
   - This will populate the database with realistic sample data (Technicians, Assets, Locations).
   ```bash
   npm run seed
   ```

5. Start the Server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Development Server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Project Structure

```
ProjectP/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── seed/           # Data seeding scripts
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API calls
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layout/         # Layout components (Navbar, Sidebar)
│   │   ├── pages/          # Main page views
│   │   ├── styles/         # Global styles
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## API Endpoints

- **Technicians**: `GET /api/technicians`, `POST /api/technicians`, `PUT /api/technicians/:id`
- **Assets**: `GET /api/assets`, `POST /api/assets`
- **Jobs**: `GET /api/jobs`, `POST /api/jobs`
- **Availability**: `GET /api/availability`
- **Locations**: `GET /api/locations`

## Intelligent Suggestions

The Job Creation form includes an intelligent suggestion engine that recommends technicians based on:
1. **Skill Match**: Technicians must have the required skills for the job.
2. **Location Match**: Technicians in the same location are prioritized.
3. **Availability**: Checks against the `AvailabilitySlot` collection to ensure the technician is free on the planned date.

## Authentication & Authorization

The system now includes robust authentication and role-based access control:

- **Authentication**:
  - Local Email/Password login.
  - OAuth integration with GitHub and Google.
  - Session-based authentication using `express-session` and `connect-mongo`.

- **Authorization**:
  - **Public Access**: Read-only endpoints (GET) are accessible to everyone.
  - **Protected Access**: Write operations (POST, PUT, DELETE) require login.
  - **Role-Based Access**: Specific actions are restricted to `ADMIN` or `PLANNER` roles.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string (Atlas or Local) |
| `SESSION_SECRET` | Secret key for signing session cookies |
| `FRONTEND_URL` | URL of the frontend application (for CORS) |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Full URL to the backend API (e.g., `http://localhost:5000/api`) |
| `VITE_BACKEND_URL` | Root URL of the backend (e.g., `http://localhost:5000`) |

## Deployment Guide

### MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access (0.0.0.0/0 for testing).
3. Get the connection string and set it as `MONGODB_URI` in your backend environment variables.

### Backend Deployment (e.g., Render, Railway)
1. Set environment variables in the dashboard (`MONGODB_URI`, `SESSION_SECRET`, etc.).
2. Set `FRONTEND_URL` to your deployed frontend domain.
3. Build command: `npm install`
4. Start command: `npm start` (ensure you have a start script or use `node src/server.js`)

### Frontend Deployment (e.g., Vercel, Netlify)
1. Set environment variables (`VITE_API_BASE_URL`, `VITE_BACKEND_URL`) to point to your deployed backend.
2. Build command: `npm run build`
3. Output directory: `dist`

## License

MIT
