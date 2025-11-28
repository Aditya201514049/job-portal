# Job Portal - Full Stack MERN/Next Js Application

A modern, full-featured job portal application built with Next.js, MongoDB, Express, and React. This platform connects job seekers with employers through a secure, role-based system with admin oversight.

## 🎯 Project Overview

This is a complete job portal system that allows:
- **Job Seekers** to browse jobs, apply to positions, and manage their profile
- **Employers** to post jobs, manage applications, and view applicants
- **Admins** to approve employers, manage users, and oversee the platform

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with role selection (Job Seeker/Employer)
- Secure login with JWT authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected API routes
- Session management with localStorage

### 👤 Job Seeker Features
- **Profile Management**: Update bio, skills, and resume URL
- **Job Browsing**: View all available job postings
- **Advanced Filtering**: Filter jobs by location and job type
- **Job Applications**: Apply to jobs (one application per job)
- **Application Tracking**: View all applied jobs with details
- **Read-only Profile Page**: View profile information

### 🏢 Employer Features
- **Account Approval**: Pending approval workflow (must be approved by admin)
- **Job Management**: Create, edit, and delete job postings
- **Applicant Management**: View applicants for each job posting
- **Applicant Details**: See applicant name, email, skills, and resume URL
- **Dashboard**: Centralized workspace for all employer activities

### 👨‍💼 Admin Features
- **Employer Approval**: Approve or reject employer registration requests
- **User Management**: View all users and their status
- **Block/Unblock Users**: Toggle user access to the platform
- **Platform Overview**: View all jobs and applications
- **Read-only Access**: Monitor all platform activities

### 🎨 UI/UX Features
- Responsive design (mobile-friendly)
- Mobile hamburger menu navigation
- Clean, modern interface with Tailwind CSS
- Glass-morphism design elements
- Smooth transitions and animations
- Role-based navigation

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Context API** - State management for authentication

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - Runtime environment
- **Express.js** - Web framework (via Next.js)

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
job-portal/
├── app/
│   ├── api/                    # API routes
│   │   ├── admin/              # Admin endpoints
│   │   │   ├── applications/   # View all applications
│   │   │   ├── employers/      # Approve/reject employers
│   │   │   ├── jobs/           # View all jobs
│   │   │   └── users/          # Block/unblock users
│   │   ├── applications/       # Job application endpoints
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── employer/           # Employer-specific endpoints
│   │   ├── jobs/                # Job CRUD endpoints
│   │   └── profile/             # User profile endpoints
│   ├── admin/
│   │   └── dashboard/          # Admin dashboard page
│   ├── employer/
│   │   └── dashboard/          # Employer dashboard page
│   ├── jobseeker/
│   │   └── dashboard/          # Job seeker dashboard page
│   ├── jobs/
│   │   └── [id]/               # Job details page
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── profile/                 # Profile page
│   ├── providers/
│   │   └── AuthProvider.js      # Authentication context
│   ├── layout.js                # Root layout
│   └── page.js                  # Home page
├── components/
│   └── Header.js                # Navigation header
├── lib/
│   ├── db.js                    # MongoDB connection
│   ├── models/                  # Mongoose models
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   └── utils/                   # Utility functions
│       ├── apiClient.js         # API client
│       ├── auth.js              # Auth utilities
│       └── middleware.js        # Auth middleware
├── public/                      # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

### 🔑 Test Credentials

For testing purposes, the following admin account is available:

- **Email**: `admin@test.com`
- **Password**: `admin123`

⚠️ **Note**: This admin user must be created in the database first (see setup instructions below).

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_jwt_key_here
   NEXT_PUBLIC_API_BASE=
   ```

   **Environment Variables:**
   - `MONGO_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/jobportal` or MongoDB Atlas URI)
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `NEXT_PUBLIC_API_BASE`: Leave empty for relative paths (recommended) or set to your deployment URL

4. **Set up MongoDB**
   
   - **Local MongoDB**: Ensure MongoDB is running locally
   - **MongoDB Atlas**: 
     - Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     - Get your connection string
     - Update `MONGO_URI` in `.env.local`
     - Whitelist your IP address (or use `0.0.0.0/0` for testing)

5. **Create Admin User**
   
   You need to create an admin user manually in MongoDB:
   ```javascript
   // In MongoDB shell or Compass
   db.users.insertOne({
     name: "Admin",
     email: "admin@example.com",
     password: "<hashed_password>", // Use bcrypt to hash
     role: "admin",
     isApproved: true,
     isBlocked: false,
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```
   
   Or use a script to hash the password:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hashedPassword = bcrypt.hashSync('your_admin_password', 10);
   // Use this hashed password in the insertOne above
   ```

   **Default Admin Credentials (for testing):**
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
   
   ⚠️ **Important**: Make sure to create this admin user in your database before testing. The password must be hashed using bcrypt before inserting into the database.

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs (with optional filters: `?location=&jobType=`)
- `GET /api/jobs/[id]` - Get job details
- `POST /api/jobs` - Create job (Employer only, requires approval)
- `PUT /api/jobs/[id]` - Update job (Employer only, own jobs)
- `DELETE /api/jobs/[id]` - Delete job (Employer only, own jobs)

### Applications
- `POST /api/applications` - Apply to a job (Job Seeker only)
- `GET /api/applications` - Get user's applications (Job Seeker only)

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Employer
- `GET /api/employer/jobs` - Get employer's jobs
- `GET /api/employer/applicants?jobId=` - Get applicants for a job

### Admin
- `GET /api/admin/employers/pending` - Get pending employers
- `PUT /api/admin/employers/[id]` - Approve/reject employer
- `GET /api/admin/jobs` - Get all jobs
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users?id=` - Block/unblock user

## 👥 User Roles & Permissions

### Job Seeker
- Can browse all jobs
- Can filter jobs by location and type
- Can apply to jobs (once per job)
- Can view applied jobs
- Can update own profile (bio, skills, resume URL)
- Cannot create jobs

### Employer
- Must be approved by admin before accessing features
- Can create job postings (after approval)
- Can edit own job postings
- Can delete own job postings
- Can view applicants for their jobs
- Cannot apply to jobs

### Admin
- Can approve/reject employer registrations
- Can view all jobs (read-only)
- Can view all applications (read-only)
- Can block/unblock any user
- Cannot be blocked by other admins
- Pre-created account (must be added manually to database)

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected API routes with middleware
- Role-based access control
- Blocked user prevention (cannot login)
- Unique email validation
- One application per job per user enforcement

## 🎨 Pages & Routes

- `/` - Home page (job listings with filters)
- `/login` - Login page
- `/register` - Registration page
- `/jobs/[id]` - Job details page
- `/jobseeker/dashboard` - Job seeker dashboard (profile edit + applications)
- `/employer/dashboard` - Employer dashboard (job management + applicants)
- `/admin/dashboard` - Admin dashboard (approvals + user management)
- `/profile` - Profile page (read-only view)

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `NEXT_PUBLIC_API_BASE` (optional, leave empty for relative paths)

3. **Configure MongoDB Atlas**
   - Ensure MongoDB Atlas allows connections from Vercel IPs
   - Or use `0.0.0.0/0` for Network Access (less secure, for testing)

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-app.vercel.app`

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `MONGO_URI` - Your MongoDB connection string
- `JWT_SECRET` - A strong, random secret key
- `NEXT_PUBLIC_API_BASE` - Leave empty (uses relative paths)

## 📝 Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: Enum ["jobseeker", "employer", "admin"] (required),
  isApproved: Boolean (default: true for jobseekers/admins, false for employers),
  isBlocked: Boolean (default: false),
  bio: String (optional),
  skills: String (optional),
  resumeURL: String (optional),
  timestamps: true
}
```

### Job Model
```javascript
{
  title: String (required),
  company: String (required),
  location: String (required),
  jobType: Enum ["Full-time", "Part-time", "Remote"] (required),
  salaryRange: String (required),
  description: String (required),
  employerId: ObjectId (ref: User, required),
  timestamps: true
}
```

### Application Model
```javascript
{
  jobId: ObjectId (ref: Job, required),
  jobSeekerId: ObjectId (ref: User, required),
  timestamps: true,
  // Unique index on (jobId, jobSeekerId)
}
```

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure
- **API Routes**: Located in `app/api/` using Next.js App Router
- **Pages**: Located in `app/` directory
- **Components**: Reusable components in `components/`
- **Utilities**: Helper functions in `lib/utils/`
- **Models**: Mongoose schemas in `lib/models/`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check `MONGO_URI` in `.env.local`
   - Ensure MongoDB is running (if local)
   - Check network access (if MongoDB Atlas)

2. **JWT Secret Error**
   - Ensure `JWT_SECRET` is set in environment variables
   - Use a strong, random string

3. **CORS Issues**
   - The app uses relative paths by default (no CORS needed)
   - If using absolute URLs, ensure `NEXT_PUBLIC_API_BASE` matches your domain

4. **Admin Access**
   - Admin must be created manually in MongoDB
   - Ensure `role: "admin"` and `isApproved: true`

## 📄 License

This project is created for assessment purposes.

## 👨‍💻 Author

Created as part of a Full Stack Developer assessment task by Adity Singha.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database solution
- Tailwind CSS for the styling framework

---

**Note**: This is a full-stack assessment project demonstrating MERN stack fundamentals, REST API design, authentication, CRUD operations, and clean UI implementation.
