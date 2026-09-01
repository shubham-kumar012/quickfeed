# 🚀 QuickFeed — Mini Social Post Application

Hey there! 👋 Welcome to **QuickFeed**, a full-stack social feed web application I built as an internship assignment.

The goal of this project was to build a modern, responsive social posting platform with clean code, secure authentication, Cloudinary image uploads with on-the-fly Sharp optimization, and an interactive feed featuring optimistic likes and comments — all strictly organized into **only 2 MongoDB collections** (`users` and `posts`).

---

## 🌐 Live Project Links (Demo)

| Service | Live URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | [https://quickfeed-frontend.vercel.app](https://quickfeed-frontend.vercel.app) *(Demo Link)* | Client application built with React & Material UI |
| **Backend REST API** | [https://quickfeed-api.onrender.com](https://quickfeed-api.onrender.com) *(Demo Link)* | Node.js & Express server connected to MongoDB |

---

## 👨‍💻 Connect With Me

If you'd like to reach out, discuss this project, or connect:

- **Portfolio**: [https://itshubham.me](https://itshubham.me)
- **LinkedIn**: [https://www.linkedin.com/in/shubham-kumar-111041267](https://www.linkedin.com/in/shubham-kumar-111041267)
- **Email**: [shubhampal7083@gmail.com](mailto:shubhampal7083@gmail.com)

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**: Fast component-based user interface.
- **React Router (v7)**: Client-side routing with `ProtectedRoute` and `PublicRoute` wrappers.
- **Material UI (MUI v6)**: Pre-built accessible components with a custom dark theme palette.
- **Context API (`AuthContext`)**: Global state to manage logged-in user session and JWT token.

### Backend
- **Node.js & Express.js**: RESTful API server.
- **MongoDB & Mongoose**: Database storage using only `users` and `posts` collections.
- **Cloudinary**: Cloud image hosting streamed directly via memory buffers.
- **Sharp**: High-performance image optimization, resizing, and WebP conversion.
- **Multer**: In-memory multipart form data handling (`multer.memoryStorage()`).
- **bcryptjs**: Password hashing (10 salt rounds) so plain-text passwords are never saved.
- **jsonwebtoken (JWT)**: Secure, stateless token authentication for private API endpoints.

---

## ✨ Key Features

### 1. Authentication & Security
- **Signup with Validation**: Validates username (3–30 chars, alphanumeric + underscores, **no spaces**), checks email regex, enforces min 6-character password with confirmation, and prevents duplicate accounts.
- **Password Hashing**: Uses `bcryptjs` before writing any user to MongoDB.
- **JWT Authorization**: Protects private routes using an Express `authMiddleware` that checks `Bearer <token>`.
- **Protected Client Routes**: Unauthenticated users cannot view `/home` and are redirected to `/login`.
- **Guest Route Protection**: Authenticated users visiting `/login` or `/signup` are redirected straight to `/home`.

### 2. Social Post Composer (Create Post)
- **Auto-Growing Textarea**: Starts compact (~72px) and expands downward naturally as you type up to 55vh before showing a slim dark scrollbar.
- **Flexible Post Types**: Supports **Text-only**, **Image-only**, or **Text + Image** combined posts.
- **Instant Image Preview**: Shows the selected image with a clean 10px rounded preview and a one-click remove button before uploading.
- **Validation**: Enforces that users write text OR select an image before posting.

### 3. Cloudinary & Sharp Image Pipeline
- **Zero Local Disk Writes**: Files are kept in memory (`multer.memoryStorage()`), resized to max 1600x1600px, compressed to WebP (`quality: 80`) using Sharp, and streamed directly to Cloudinary.
- **Fast Delivery**: The database stores only Cloudinary's secure HTTPS URL.

### 4. Likes & Comments (Interactive Social Actions)
- **Optimistic UI Updates**: Likes and comments update immediately on the screen without waiting for network latency. If an API request fails, the UI rolls back automatically and displays an alert toast.
- **Atomic MongoDB Operations**: Uses `$addToSet` for liking and `$pull` for unliking to prevent duplicate likes without needing a separate collection.
- **Zero-Count Display Rule**: If a post has 0 likes or 0 comments, only the icon is displayed without showing a zero (`0`).
- **Embedded Comments**: Comments live inside the post document in MongoDB with author references and timestamps.
- **Delete Own Comments**: Users can delete comments they wrote with a single click; other users' comments cannot be deleted.

### 5. Public Feed
- Displays all community posts ordered by newest first (`createdAt: -1`).
- Dynamic real-time updates when a user creates a new post.
- Friendly relative timestamps (*"Just now"*, *"5m ago"*, *"2h ago"*, *"Yesterday"*).

---

## 📁 Project Folder Structure

```text
quickfeed/
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg              # QuickFeed dark SVG favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthLayout.jsx       # Centered container for login/signup forms
│   │   │   ├── Navbar.jsx           # Top navigation bar with user profile & logout
│   │   │   ├── CreatePost.jsx       # Post composer with auto-grow & image preview
│   │   │   ├── PostCard.jsx         # Post feed item with optimistic likes & comments
│   │   │   ├── ProtectedRoute.jsx   # Route guard for authenticated users
│   │   │   └── PublicRoute.jsx      # Route guard for public/guest pages
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global React Context for login state
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Sign in page with email/password validation
│   │   │   ├── Signup.jsx           # Registration page with strict username rules
│   │   │   └── Home.jsx             # Public feed & post creation screen
│   │   ├── services/
│   │   │   ├── authService.js       # Centralized authentication API calls
│   │   │   └── postService.js       # Centralized posts, likes & comments API calls
│   │   ├── utils/
│   │   │   └── formatDate.js        # Relative time helper function
│   │   ├── App.jsx                  # Main application routes
│   │   ├── main.jsx                 # Vite application entry point
│   │   └── theme.js                 # Material UI dark theme configuration
│   ├── vite.config.js               # Vite config with backend proxy
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── cloudinary.js            # Cloudinary SDK credentials setup
│   ├── controllers/
│   │   ├── authController.js        # Signup, login, and getMe controller logic
│   │   └── postController.js        # Create post, like, comment, and delete controller
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT token verification middleware
│   │   └── uploadMiddleware.js      # Multer RAM storage and 5MB image filter
│   ├── models/
│   │   ├── User.js                  # User schema (username, email, password)
│   │   └── Post.js                  # Post schema (text, image, likedBy, comments)
│   ├── routes/
│   │   ├── authRoutes.js            # Express routes for authentication
│   │   └── postRoutes.js            # Express routes for posts, likes & comments
│   ├── .env.example                 # Template for required environment variables
│   ├── server.js                    # Express app entry & MongoDB connection
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` directory based on `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/quickfeed
JWT_SECRET=your_super_secret_jwt_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🚀 How to Run Locally

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```
> The backend will start on **`http://localhost:5000`**.

### 2. Start the Frontend Client

Open a second terminal window:

```bash
cd frontend
npm install
npm run dev
```
> The frontend will start on **`http://localhost:3000`** (and automatically proxies `/api` requests to port `5000`).

---

## 📡 REST API Summary

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Get currently logged-in user profile |
| `GET` | `/api/posts` | Public | Fetch all community posts (newest first) |
| `POST` | `/api/posts` | Private | Create new post (text, image, or both) |
| `POST` | `/api/posts/:postId/like` | Private | Like a post |
| `DELETE` | `/api/posts/:postId/like` | Private | Unlike a post |
| `POST` | `/api/posts/:postId/comments` | Private | Add a comment to a post |
| `DELETE` | `/api/posts/:postId/comments/:commentId` | Private | Delete author's own comment |

---

## 💡 Key Design Decisions

1. **Strictly Two MongoDB Collections**:
   - Instead of separate collections for likes and comments, likes are stored as user ID references in `likedBy: [ObjectId]` and comments are embedded directly in `comments: [{ user, text, createdAt }]` within each post. This keeps database reads fast and avoids unnecessary collection joins.
2. **In-Memory Image Pipeline**:
   - Uploaded images are held in RAM via `multer.memoryStorage()`, resized and converted to lightweight `.webp` format via `sharp`, and streamed directly to Cloudinary. No temporary files are saved to the server's local hard drive.
3. **Optimistic UI with Error Rollback**:
   - Clicking like or adding a comment updates the local React state immediately so users get instant feedback. If the network request fails, the app automatically reverts the change and informs the user via a snackbar alert.

---

## 📄 License
This project is open-source and built for educational and portfolio demonstration purposes.
