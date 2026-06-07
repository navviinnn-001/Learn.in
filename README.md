# Learn.in — Online Course Management Portal
### MERN Stack College Project

---

## Project Structure

```
Learn.in/
├── backend/                  ← Node.js + Express API
│   ├── server.js             ← Entry point, connects to MongoDB
│   ├── .env                  ← Environment variables (edit this!)
│   ├── models/
│   │   ├── User.js           ← User schema (name, email, password, role)
│   │   ├── Course.js         ← Course schema (title, lessons, instructor)
│   │   └── Enrollment.js     ← Enrollment schema (student + course + progress)
│   ├── controllers/
│   │   ├── authController.js     ← Register, Login, Get Profile
│   │   ├── courseController.js   ← CRUD for courses
│   │   └── enrollController.js   ← Enroll, track progress, dashboard stats
│   ├── routes/
│   │   ├── authRoutes.js     ← /api/auth/*
│   │   ├── courseRoutes.js   ← /api/courses/*
│   │   └── enrollRoutes.js   ← /api/enroll/*
│   └── middleware/
│       └── authMiddleware.js ← protect (JWT check) + authorize (role check)
│
└── frontend/                 ← React + Vite
    └── src/
        ├── App.jsx            ← Root component with all routes
        ├── main.jsx           ← Mounts React into index.html
        ├── index.css          ← Global styles
        ├── context/
        │   └── AuthContext.jsx ← Global auth state (no Redux!)
        ├── utils/
        │   └── api.js          ← Axios with auto JWT header
        ├── components/
        │   ├── Navbar.jsx      ← Top navigation
        │   ├── PrivateRoute.jsx ← Route guard
        │   └── CourseCard.jsx  ← Reusable course card
        └── pages/
            ├── Home.jsx        ← Landing page
            ├── Login.jsx       ← Login form
            ├── Register.jsx    ← Registration form
            ├── Dashboard.jsx   ← Student/Instructor dashboard
            ├── Courses.jsx     ← Browse all courses
            ├── CourseDetail.jsx ← Single course + enroll + progress
            ├── InstructorPanel.jsx ← Manage own courses
            ├── CreateCourse.jsx ← Create new course
            └── EditCourse.jsx  ← Edit existing course
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017)

---

### Step 1: Start MongoDB
Make sure MongoDB is running:
```bash
mongod
```

---

### Step 2: Backend Setup

```bash
cd Learn.in/backend
npm install
npm run dev
```
Backend runs on: **http://localhost:5000**

---

### Step 3: Frontend Setup

Open a **new terminal**:
```bash
cd Learn.in/frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

## API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Protected | Get my profile |

### Courses
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | /api/courses | Public | All courses |
| GET | /api/courses/:id | Public | Single course |
| GET | /api/courses/instructor/my-courses | Instructor | My courses |
| POST | /api/courses | Instructor | Create course |
| PUT | /api/courses/:id | Instructor | Update course |
| DELETE | /api/courses/:id | Instructor | Delete course |

### Enrollment
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/enroll/:courseId | Student | Enroll in course |
| GET | /api/enroll/my-courses | Student | My enrollments |
| PUT | /api/enroll/:courseId/lesson/:lessonId | Student | Mark lesson done |
| GET | /api/enroll/dashboard | Student | Dashboard stats |

---

## Key Concepts for Viva

**MVC Architecture:**
- **Model** = MongoDB schema (User, Course, Enrollment)
- **View** = React frontend (pages, components)
- **Controller** = Express functions (authController, courseController, etc.)

**JWT Authentication:**
- User logs in → server creates a signed token → frontend stores it
- Every protected request sends: `Authorization: Bearer <token>`
- Server verifies token with the secret key

**bcrypt:**
- Hashes passwords before saving (one-way, can't reverse)
- Uses `.compare()` during login to check password

**React Context API:**
- Used instead of Redux to share auth state globally
- `AuthProvider` wraps the whole app
- Any component uses `useAuth()` to access user data

**Role-Based Access:**
- Student: enroll, track progress, view courses
- Instructor: create, edit, delete their own courses
