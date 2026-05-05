 🚀 EzApply — Full-Stack Job Portal System

EzApply is a scalable full-stack job portal that enables job seekers to discover opportunities and apply to jobs, while recruiters can create listings and manage applicants through a role-based system.
Built with a focus on clean architecture, secure authentication, and real-world backend workflows.

---

🌐 Live Demo
🔗 https://ezapply-frontend.vercel.app/





---

## 🧠 Problem It Solves

Traditional job platforms often lack clear role separation and efficient application tracking.
EzApply addresses this by providing:

* Structured job workflows for both recruiters and candidates
* Secure role-based access control
* Centralized application tracking system

---

## ✨ Key Features

### 👨‍💼 Job Seekers

* Browse and explore job listings
* View detailed job descriptions
* Apply to jobs with a single click
* Track application status

### 🧑‍💻 Recruiters

* Create, update, and manage job postings
* View applicants per job
* Manage hiring workflows

### 🔐 Authentication & Security

* JWT-based authentication
* Password hashing using bcrypt
* Role-based authorization (Job Seeker / Recruiter)
* Protected routes for secure access

### 📊 Dashboard & Insights

* Role-specific dashboards
* Data visualization using charts (Recharts)

---

## 🏗️ System Architecture

EzApply follows a **modular MVC architecture**:

* **Controllers** → Handle API logic and request flow
* **Services** → Manage business logic
* **Routes** → Define endpoints
* **Database** → PostgreSQL (relational schema)

This ensures:

* Scalability
* Maintainability
* Clear separation of concerns

---

## 🔁 Application Flow

1. User registers or logs in
2. JWT token is generated and validated via middleware
3. Role-based access controls routes
4. Recruiters post jobs → stored in database
5. Job seekers apply → applications linked to users and jobs
6. Recruiters review applicants via dashboard

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router
* Tailwind CSS
* Axios
* Recharts

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT (Authentication)
* bcrypt (Password Hashing)

### Tools

* Postman (API Testing)
* Git & GitHub
* Vercel (Deployment)

---

## 🔌 API Highlights

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| POST   | /api/auth/register     | Register user          |
| POST   | /api/auth/login        | Login user             |
| GET    | /api/jobs              | Get all jobs           |
| POST   | /api/jobs              | Create job (Recruiter) |
| POST   | /api/applications      | Apply to job           |
| GET    | /api/applications/user | Get user applications  |

---

## 🔐 Demo Credentials

**Job Seeker**

* Email: [demo@user.com](mailto:demo@user.com)
* Password: demo123

**Recruiter**

* Email: [recruiter@demo.com](mailto:recruiter@demo.com)
* Password: demo123

---

## ⚙️ Local Setup

### Clone Repository

```bash
git clone https://github.com/your-username/ezapply.git
cd ezapply
```

### Backend Setup

```bash
cd ezapply-backend
npm install
```

Create `.env` file:

```env
PORT=5000
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd ../ezapply-frontend
npm install
npm run dev
```

---

## 🚀 Deployment

* Backend deployed as serverless functions on Vercel
* Frontend deployed using Vite + Vercel
* Environment variables configured for production

---

## 🧪 Testing & Debugging

* Tested API endpoints using Postman
* Handled edge cases and request validation
* Debugged request/response cycles for reliability

---

## 📌 Future Improvements

* Resume upload & parsing system
* Advanced job filtering (location, salary, skills)
* Email notifications for applications
* Real-time updates using WebSockets

---

## 👨‍💻 Author

**Tanishq Sharma**

🔗 LinkedIn: https://www.linkedin.com/in/tanishq-sharma-377931287/

🔗 Gmail: sharmatanishq.dev@gmail.com

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
