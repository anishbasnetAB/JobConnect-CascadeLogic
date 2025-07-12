# Job Connect - MERN Stack Job Portal

Job Connect is a fully functional Job Portal web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This group project was developed to streamline the process of job posting, application, and talent acquisition by connecting job seekers with employers through a modern, secure platform.

## Features

### Job Seeker
- Register and verify via email
- Browse active job postings
- Apply to jobs with PDF or image CV upload
- View and manage saved jobs
- Track application status
- Like and comment on employer blogs

### Employer
- Register with company card verification
- Post, edit, and delete job listings
- Manage applicants and update their status
- Write and manage blog posts
- View job and blog performance statistics

### Admin
- Delete employer accounts, jobs, and blogs
- Access all platform content
- Protected by secure role-based authorization

## Security and Validation

- JWT-based authentication and role-based access control
- Email verification during registration
- File upload restricted to PDF and image formats with size limits
- Input sanitization to prevent XSS (Cross-Site Scripting)
- HTTP header security with Helmet and HPP
- Redis caching for efficient data retrieval

## Technology Stack

| Category       | Technology           |
|----------------|----------------------|
| Frontend       | React.js (Vite), Tailwind CSS |
| Backend        | Node.js, Express.js  |
| Database       | MongoDB Atlas        |
| Authentication | JWT, Bcrypt, Nodemailer |
| File Upload    | Multer (Company ID, CVs, Blog Images) |
| Caching        | Redis (ioredis)      |
| Form Handling  | React Hook Form, Yup |

## Installation and Setup
- backend>>npm i>npm start
- frontend>>npm i>npm run dev

### Prerequisites

- Node.js and npm
- MongoDB Atlas account (or local MongoDB)
- Redis (locally or hosted)
- A Gmail account for sending verification/reset emails

### Environment Variables

Create a `.env` file in the `/backend` directory with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
BASE_URL=http://localhost:5173
