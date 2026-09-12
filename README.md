# User Management App

A full-stack user management system with separate **User** and **Admin** experiences, built with React, Redux Toolkit, Node.js/Express, and MongoDB. Authentication is handled with JWT, passwords are hashed with bcrypt, and profile images are uploaded to Cloudinary.

## Tech Stack

**Frontend**
- React 19 + Vite
- Redux Toolkit + React Redux (auth/session state)
- React Router
- Tailwind CSS v4
- Axios
- React Toastify (notifications)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- Multer + Cloudinary for profile image uploads

## Features

**User side**
- Register / Login / Logout
- View and update profile
- Upload / change profile picture

**Admin side**
- Admin login (role-based, same login endpoint as users)
- View all users (paginated)
- Search users by name or email
- Create, edit, and delete user accounts

## Project Structure

```
user-management-app/
├── backend/
│   ├── config/            # MongoDB connection
│   ├── controllers/       # Route handler logic
│   ├── middleware/        # Auth, admin, upload, validation middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express route definitions
│   ├── .env.example       # Template for required environment variables
│   └── server.js          # App entry point
│
└── frontend/
    ├── public/
    └── src/
        ├── app/           # Redux store
        ├── components/    # Navbar, Avatar, Logo, etc.
        ├── features/      # Redux slices
        ├── pages/         # Home, Login, Register, Profile, AdminDashboard
        └── services/      # Axios API instance
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB database (local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A free [Cloudinary](https://cloudinary.com/) account (for profile image uploads)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd user-management-app
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `.env` with your own values:

| Variable | Description |
|---|---|
| `PORT` | Port the API runs on (defaults to 5000) |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Any long, random string used to sign JWTs |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |

Start the server:
```bash
npm run dev
```
The API will run at `http://localhost:5000`.

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
The app will run at `http://localhost:5173` (Vite's default).

> Note: the frontend currently points at `http://localhost:5000/api` in `src/services/api.js`. Update that base URL when deploying to a real backend host.

### 4. Create your first admin
There's no separate admin signup — register a normal account, then manually set that user's `role` field to `"admin"` in MongoDB (via Atlas, Compass, or the mongo shell). From there, that account can log in and reach the Admin Dashboard, and can promote/create further admins from the dashboard itself.

## API Reference

All endpoints are prefixed with `/api/users`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Log in (user or admin) |
| GET | `/profile` | Authenticated | Get the logged-in user's profile |
| PUT | `/profile` | Authenticated | Update the logged-in user's profile |
| POST | `/upload` | Authenticated | Upload/replace profile image |
| GET | `/` | Admin only | List all users (supports `search`, `page`, `limit` query params) |
| POST | `/` | Admin only | Create a new user |
| PUT | `/:id` | Admin only | Edit a user by ID |
| DELETE | `/:id` | Admin only | Delete a user by ID |

Authenticated requests must include `Authorization: Bearer <token>`.

## License

MIT — feel free to use this as a starting point for your own projects.
