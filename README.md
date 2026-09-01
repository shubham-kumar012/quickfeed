# Mini Social Post Application

A clean, modern, full-stack social posting application foundation built with **React (JavaScript)**, **Material UI (MUI)**, **Node.js/Express**, **MongoDB (Mongoose)**, **bcryptjs**, and **JWT**.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router v7** (Client-side routing & Protected Routes)
- **Material UI (MUI v6)** (Dark mode theme, components, responsive layouts)
- **Vanilla CSS / Emotion** (Custom dark-mode styles)

### Backend
- **Node.js & Express.js** (REST API)
- **MongoDB & Mongoose** (Database & User Schema)
- **bcryptjs** (Password hashing with salt rounds)
- **jsonwebtoken (JWT)** (Stateless token authentication)
- **dotenv** (Environment variable management)
- **cors** (Cross-Origin Resource Sharing)

---

## ✨ Features Currently Implemented

- [x] **User Registration (Signup)**: Input validation (username, email regex, min-length password, password confirmation), duplicate email check (409 Conflict), bcrypt hashing, and automatic JWT issuance.
- [x] **User Authentication (Login)**: Secure credential validation, bcrypt password comparison, JWT generation, and generic error messages to prevent user enumeration.
- [x] **JWT Authentication & Middleware**: Bearer token verification middleware guarding private endpoints.
- [x] **Current User Endpoint (`/api/auth/me`)**: Protected route returning sanitized user information (password is never exposed).
- [x] **Persistent Session Management (`AuthContext`)**: Client-side state storing token in `localStorage`, verifying validity on refresh, and maintaining seamless login sessions.
- [x] **Protected Routes**: Restricts access to `/home` for authenticated users and redirects unauthenticated users to `/login`.
- [x] **Public Route Guards**: Automatically redirects authenticated users away from `/login` and `/signup` directly to `/home`.
- [x] **User Logout**: Clears stored tokens and state, safely redirecting to `/login`.
- [x] **Professional Dark UI**: Restrained charcoal/slate color palette (`#0B1120`, `#151D2E`, `#3B82F6`), subtle borders, modest 6px border radii, accessible password visibility toggles, and clear validation feedback.
- [x] **Responsive Design**: Fluid layout adapting cleanly across mobile, tablet, and desktop viewports.

---

## 🚀 Future Features (Upcoming Phases)

- [ ] Create text posts
- [ ] Image uploads for posts
- [ ] Likes and interaction counts
- [ ] Comments section
- [ ] Feed pagination & infinite scroll
- [ ] User profile pages & avatars

---

## 📁 Project Structure

```text
quickfeed/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthLayout.jsx       # Centered auth wrapper with brand header
│   │   │   ├── Navbar.jsx           # Sticky top navbar with user profile & logout
│   │   │   ├── ProtectedRoute.jsx   # Route guard for authenticated pages
│   │   │   └── PublicRoute.jsx      # Route guard for unauthenticated pages
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # React Context managing auth state, login & logout
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Sign in page with validation & password toggle
│   │   │   ├── Signup.jsx           # Account registration page
│   │   │   └── Home.jsx             # Social feed placeholder & dynamic user greeting
│   │   ├── services/
│   │   │   └── authService.js       # Centralized API fetch handlers
│   │   ├── App.jsx                  # React Router routes and provider setup
│   │   ├── main.jsx                 # Application entry with MUI ThemeProvider
│   │   └── theme.js                 # Professional dark-mode MUI theme
│   ├── vite.config.js               # Vite config with backend API proxy
│   └── package.json                 # Frontend dependencies
│
├── backend/
│   ├── controllers/
│   │   └── authController.js        # Signup, Login, and GetMe business logic
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT Bearer token verification middleware
│   ├── models/
│   │   └── User.js                  # Mongoose schema for User
│   ├── routes/
│   │   └── authRoutes.js            # Express router mapping auth endpoints
│   ├── .env                         # Environment variables (ignored in git)
│   ├── .env.example                 # Example environment template
│   ├── server.js                    # Express app entry & database connection
│   └── package.json                 # Backend dependencies
│
├── .gitignore                       # Git ignore rules for node_modules and .env
└── README.md                        # Documentation
```

---

## 🔑 Environment Variables

The backend requires the following environment variables configured in `backend/.env`:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port number the backend server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string (Local or MongoDB Atlas) | `mongodb+srv://<user>:<password>@cluster.mongodb.net/quickfeed` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | `your_secure_jwt_secret_key` |

A `.env.example` template is provided in `backend/.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/socially_db
JWT_SECRET=your_jwt_secret_key_here
```

---

## 💻 Running Locally

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file (copy from `.env.example` and set your MongoDB URI):
   ```bash
   cp .env.example .env
   ```

4. Start the backend server:
   ```bash
   # Production / regular run
   npm start

   # Or Development mode with nodemon
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000` (automatically proxies `/api` requests to port `5000`).*

4. Open your browser and navigate to `http://localhost:3000`.

---

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register a new user (`username`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Log in with credentials (`email`, `password`) |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile (requires `Bearer <token>`) |

---

## 🎓 Interview Talking Points (Key Concepts)

1. **Password Security**: Passwords are never stored in plain text. We hash them using `bcryptjs` with 10 salt rounds before persisting to MongoDB.
2. **Stateless Authentication**: Using JSON Web Tokens (JWT) allows the server to authenticate requests without storing session state in server memory or Redis.
3. **Information Disclosure Prevention**: On failed logins, a generic error message ("Invalid email or password") is returned to prevent attackers from discovering valid email addresses.
4. **Clean Layer Separation**:
   - `models/` defines data schema & constraints.
   - `controllers/` contains request handling and business logic.
   - `middleware/` intercepts requests to enforce authentication checks.
   - `routes/` provides clean mapping of HTTP methods and URLs.
   - `services/` on the frontend encapsulates network communication cleanly away from UI components.
