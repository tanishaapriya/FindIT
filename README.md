# 🔍 FindIt — Lost & Found Management System

> A full-stack mobile-first web app to help students report, search, and recover lost & found items on campus.

🌐 **Live Demo:** [https://findit-yifb.onrender.com](https://findit-yifb.onrender.com)  
📁 **GitHub:** [https://github.com/tanishaapriya/FindIT](https://github.com/tanishaapriya/FindIT)

---

## ✨ Features

- 🔐 **User Authentication** — Secure login & signup with JWT tokens
- 📦 **Report Items** — Report lost or found items with details
- 📷 **Photo Upload** — Add photos to help identify items faster
- 🔍 **Search & Filter** — Search by name, filter by location or category
- 🎯 **Auto Match Detection** — Automatically detects possible matches between lost & found items
- 🗺️ **Map Location Picker** — Pick location visually using an interactive map
- ✅ **Mark as Resolved** — Mark items as returned/resolved when reunited
- 👤 **Profile with Photo** — Upload a profile picture
- 🔒 **Privacy Settings** — Control visibility and notification preferences
- 📧 **Email Notifications** — Get notified via email when a match is found
- 🛡️ **Admin Dashboard** — Manage all users and items
- 📥 **Export Data** — Download your reports as JSON

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML, CSS, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs |
| **Email** | Nodemailer (Gmail) |
| **Maps** | Leaflet.js + OpenStreetMap |
| **Deployment** | Render + MongoDB Atlas |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)

### 1. Clone the repository
```bash
git clone https://github.com/tanishaapriya/FindIT.git
cd FindIT
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/findit?appName=Cluster0
JWT_SECRET=your_secret_key_here
PORT=5000

# Optional — for email notifications
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
APP_URL=http://localhost:5000
```

### 4. Run the app
```bash
node server.js
```

### 5. Open in browser
```
http://localhost:5000
```

---

## 📁 Project Structure

```
FindIT/
├── server.js              # Express server entry point
├── package.json
├── .env                   # Environment variables (not committed)
├── .gitignore
├── render.yaml            # Render deployment config
├── middleware/
│   └── auth.js            # JWT authentication guard
├── models/
│   ├── User.js            # User schema (bcrypt password hashing)
│   └── Item.js            # Lost/Found item schema
├── routes/
│   ├── auth.js            # /api/auth — login, register, profile
│   └── items.js           # /api/items — CRUD operations
├── utils/
│   └── mailer.js          # Nodemailer email notifications
└── public/
    └── index.html         # Full frontend (single page app)
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PATCH | `/api/auth/photo` | Update profile photo |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items (with filters) |
| POST | `/api/items` | Create new report |
| GET | `/api/items/:id` | Get single item |
| DELETE | `/api/items/:id` | Delete item (owner only) |
| PATCH | `/api/items/:id/resolve` | Mark as resolved |

---

## 🌐 Deployment

Deployed on **Render** (free tier):

1. Push code to GitHub
2. Connect repo to [render.com](https://render.com)
3. Set environment variables in Render dashboard
4. Allow all IPs in MongoDB Atlas Network Access (`0.0.0.0/0`)
5. Deploy!

---

## 👩‍💻 Developer

**Tanisha Priya**  
📧 priyatanisha175@gmail.com  
🐙 [github.com/tanishaapriya](https://github.com/tanishaapriya)

---

## 📄 License

This project is licensed under the **MIT License** — free to use, share, and learn from.

---

> Built with ❤️ as a student project — FindIt helps campuses reunite lost items with their owners!
