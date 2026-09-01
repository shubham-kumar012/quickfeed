# Mini Social Post Application

A clean, modern, full-stack social posting application built with **React (JavaScript)**, **Material UI (MUI)**, **Node.js/Express**, **MongoDB (Mongoose)**, **Cloudinary**, **Sharp**, **bcryptjs**, and **JWT**.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router v7** (Client-side routing & Protected Routes)
- **Material UI (MUI v6)** (Dark mode theme, seamless auto-growing composer, responsive layouts)
- **Vanilla CSS / Emotion** (Custom dark-mode styles)

### Backend
- **Node.js & Express.js** (REST API)
- **MongoDB & Mongoose** (Database collections: `users` and `posts`)
- **Cloudinary** (Cloud image storage via `upload_stream`)
- **Sharp** (High-performance in-memory image resizing, compression & WebP conversion)
- **Multer** (In-memory multipart upload processing)
- **bcryptjs** (Password hashing with salt rounds)
- **jsonwebtoken (JWT)** (Stateless token authentication)
- **dotenv** (Environment variable management)
- **cors** (Cross-Origin Resource Sharing)

---

## ✨ Features Currently Implemented

### 1. Authentication & Security
- [x] **User Registration (Signup)**: Input validation (username, email format, minimum password length, password confirmation), duplicate email check (409 Conflict), bcrypt hashing (10 salt rounds), and automatic JWT issuance.
- [x] **User Authentication (Login)**: Secure credential validation, bcrypt password comparison, JWT generation, and generic error messages to prevent user enumeration.
- [x] **JWT Authentication & Middleware**: Bearer token verification middleware guarding private endpoints (`/api/auth/me`, `POST /api/posts`).
- [x] **Current User Endpoint (`/api/auth/me`)**: Protected route returning sanitized user information (password is never exposed).
- [x] **Persistent Session Management (`AuthContext`)**: Client-side state storing token in `localStorage`, verifying validity on refresh, and maintaining seamless login sessions.
- [x] **Protected Routes**: Restricts access to `/home` for authenticated users and redirects unauthenticated users to `/login`.
- [x] **Public Route Guards**: Automatically redirects authenticated users away from `/login` and `/signup` directly to `/home`.
- [x] **User Logout**: Clears stored tokens and state, safely redirecting to `/login`.

### 2. Social Composer (Create Post)
- [x] **Seamless Auto-Growing Composer**: Starts compact (~48px–64px height) without a boxy border, naturally expanding downward as the user types.
- [x] **Viewport-Based Scroll**: Dynamically caps maximum textarea height to the usable viewport (`calc(100vh - 300px)`), enabling vertical scrolling only when reaching the maximum threshold.
- [x] **Post Types Supported**:
  - Text-only posts
  - Image-only posts
  - Text + Image combined posts
- [x] **Image Preview**: Displays below the text content with clean rounded borders (6px–8px) and a one-click top-right removal button.
- [x] **Post Validation**: Requires at least text or an image before posting (empty submissions are prevented and rejected with HTTP 400).
- [x] **Interactive Action Bar**: Minimal bottom bar containing an "Add image" file selector and "Post" button with loading state (*"Posting..."*).

### 3. Cloudinary & Sharp Image Pipeline
- [x] **Zero Local File Storage**: Uploaded files exist purely in-memory buffer via `multer.memoryStorage()`. No local disk writes or static upload directories.
- [x] **Sharp Image Optimization**: Images are automatically downscaled if exceeding 1600x1600px without upscaling smaller media.
- [x] **WebP Compression**: Images are compressed and converted into lightweight WebP format (`quality: 80`).
- [x] **Cloudinary Storage**: Streamed directly to Cloudinary into the `mini-social-app/posts` folder, persisting only the HTTPS `secure_url` in MongoDB.

### 4. Public Social Feed
- [x] **All Public Posts**: Retrieves all posts created across the platform.
- [x] **Sorted Chronologically**: Newest posts automatically appear first (`createdAt: -1`).
- [x] **Post Author Info**: Displays author's initial avatar and username.
- [x] **Relative Timestamp**: Human-friendly relative time (e.g. *Just now*, *5m ago*, *2h ago*, *Yesterday*).
- [x] **Dynamic Real-Time Update**: Newly created posts appear instantly at the top of the feed without needing a page refresh.
- [x] **Feed States**: Smooth loading indicator, empty feed encouragement, and error retry state.

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
│   │   │   ├── CreatePost.jsx       # Auto-growing composer with image preview
│   │   │   ├── PostCard.jsx         # Post feed item displaying author, text, Cloudinary image, time
│   │   │   ├── ProtectedRoute.jsx   # Route guard for authenticated pages
│   │   │   └── PublicRoute.jsx      # Route guard for unauthenticated pages
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # React Context managing auth state, login & logout
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Sign in page with validation & password toggle
│   │   │   ├── Signup.jsx           # Account registration page
│   │   └── Home.jsx                 # Social feed & post creation page
│   │   ├── services/
│   │   │   ├── authService.js       # Centralized auth API fetch handlers
│   │   │   └── postService.js       # Centralized posts API fetch handlers
│   │   ├── utils/
│   │   │   └── formatDate.js        # Human-friendly relative time formatter
│   │   ├── App.jsx                  # React Router routes and provider setup
│   │   ├── main.jsx                 # Application entry with MUI ThemeProvider
│   │   └── theme.js                 # Professional dark-mode MUI theme
│   ├── vite.config.js               # Vite config with backend API proxy
│   └── package.json                 # Frontend dependencies
│
├── backend/
│   ├── config/
│   │   └── cloudinary.js            # Cloudinary SDK configuration
│   ├── controllers/
│   │   ├── authController.js        # Signup, Login, and GetMe business logic
│   │   └── postController.js        # CreatePost (Sharp + Cloudinary) & GetPosts logic
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT Bearer token verification middleware
│   │   └── uploadMiddleware.js      # Multer memory storage and filetype/size filter
│   ├── models/
│   │   ├── User.js                  # Mongoose schema for User
│   │   └── Post.js                  # Mongoose schema for Post (stores Cloudinary URL)
│   ├── routes/
│   │   ├── authRoutes.js            # Express router mapping auth endpoints
│   │   └── postRoutes.js            # Express router mapping posts endpoints
│   ├── .env                         # Environment variables (ignored in git)
│   ├── .env.example                 # Example environment template
│   ├── server.js                    # Express app entry, routes & database connection
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
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |

A `.env.example` template is provided in `backend/.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/socially_db
JWT_SECRET=your_jwt_secret_key_here

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
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

3. Configure your `.env` file with MongoDB and Cloudinary credentials:
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
| `POST` | `/api/posts` | Private | Create post with text and/or in-memory image buffer |
| `GET` | `/api/posts` | Public | Fetch all public posts sorted newest first |

---

## 🎓 Interview Talking Points (Key Concepts)

1. **In-Memory Streaming vs Disk Storage**: Uploaded files never touch the server disk. `multer.memoryStorage()` retains the file in RAM buffer, `sharp` optimizes and converts to WebP in-memory, and `cloudinary.uploader.upload_stream` streams the buffer directly to the cloud.
2. **Bandwidth & Storage Optimization**: Automatic image resizing (max 1600x1600) and WebP compression (`quality: 80`) significantly reduce payload sizes and cloud storage requirements while maintaining high visual fidelity.
3. **Seamless Composer UX**: The text input starts compact and frameless, expanding downward with typing, capped at viewport height (`calc(100vh - 300px)`) with scrollbars appearing only when the content exceeds the ceiling.
4. **Optimistic Feed Updates**: Newly published posts are prepended directly to React state (`setPosts(prev => [newPost, ...prev])`), updating the feed instantly without a full page refresh.
