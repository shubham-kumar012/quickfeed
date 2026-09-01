# Socially — Mini Social Post Application

A clean, modern social posting application starter built with **React (JavaScript)**, **Material UI (MUI)**, **Node.js/Express**, and **MongoDB (Mongoose)**.

---

## 📁 Project Structure

```text
quickfeed/
├── backend/
│   ├── models/
│   │   └── User.js             # Mongoose User schema with validation, lowercase email, timestamps
│   ├── .env.example            # Environment variables template
│   └── package.json            # Minimal backend package configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthLayout.jsx  # Reusable centered auth layout with branding
│   │   │   └── Navbar.jsx      # Sticky top navigation bar for demo/home page
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login UI with validation, visibility toggle & placeholder handler
│   │   │   ├── Signup.jsx      # Signup UI with full field validation & password confirmation
│   │   │   └── Home.jsx        # Demo home page with user greeting, feed placeholder & post action
│   │   ├── App.jsx             # React Router routing configuration
│   │   ├── main.jsx            # React root with MUI ThemeProvider & CssBaseline
│   │   └── theme.js            # Restrained MUI theme (charcoal, slate-blue, 6px radius)
│   ├── index.html              # HTML shell with Inter typography
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Frontend Setup

1. Open a terminal in the `frontend` folder:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000` (or the URL displayed in the terminal).

---

### 2. Backend Setup

1. Open a terminal in the `backend` folder:
   ```bash
   cd backend
   npm install
   ```

2. Copy `.env.example` to `.env` and set your MongoDB connection string:
   ```bash
   cp .env.example .env
   ```

---

## 🧭 Routes & Pages

| Route | Page | Description |
| :--- | :--- | :--- |
| `/login` | **Login** | Email & password form with visibility toggle, client validation, and placeholder submit |
| `/signup` | **Signup** | Username, email, password, confirm password form with validation |
| `/home` | **Demo Home** | Placeholder social feed page with navigation header and "Create your first post" |
| `/` | *Redirect* | Automatically redirects to `/login` |

---

## 🔌 Connecting Your Authentication API Later

Both `Login.jsx` and `Signup.jsx` include clearly marked placeholder handlers:

- **Login (`frontend/src/pages/Login.jsx`)**:
  ```javascript
  const handleLogin = async (e) => {
    e.preventDefault();

    // -------------------------------------------------------------
    // TODO: Connect authentication API here
    // Example:
    // const response = await api.post('/api/auth/login', formData);
    // localStorage.setItem('token', response.data.token);
    // -------------------------------------------------------------

    navigate("/home");
  };
  ```

- **Signup (`frontend/src/pages/Signup.jsx`)**:
  ```javascript
  const handleSignup = async (e) => {
    e.preventDefault();

    // -------------------------------------------------------------
    // TODO: Connect registration/signup API here
    // Example:
    // const response = await api.post('/api/auth/signup', formData);
    // localStorage.setItem('token', response.data.token);
    // -------------------------------------------------------------

    navigate("/home");
  };
  ```

---

## 🗄️ Backend User Model

The User schema is defined in [`backend/models/User.js`](file:///d:/Learning/quickfeed/backend/models/User.js):

- `username`: Required string, trimmed, min 3 chars, max 30 chars.
- `email`: Required string, unique, trimmed, automatically lowercased, validated against email format regex.
- `password`: Required string, min 6 chars.
- `timestamps`: Automatically manages `createdAt` and `updatedAt`.
