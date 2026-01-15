# Benthel Attendance System

A modern attendance management application built with React, Vite, Tailwind CSS, and Supabase. This system provides role-based dashboards for Admins, Teachers, Students, and Parents to manage and view attendance records efficiently.

## Features

- Authentication & Authorization: Secure login and signup powered by Supabase Auth.
- Role-Based Access Control (RBAC): Distinct dashboards and features based on user roles:
  - Admin: Full system oversight.
  - Teacher: Manage class attendance.
  - Student/Parent: View attendance records.
- Modern UI: Responsive and clean interface designed with Tailwind CSS v4 and Lucide icons.
- Real-time Data: Leverages Supabase for real-time data synchronization.

## Tech Stack

- Frontend Framework: [React 19](https://react.dev/)
- Build Tool: [Vite](https://vitejs.dev/)
- Styling: [Tailwind CSS v4](https://tailwindcss.com/)
- Routing: [React Router v7](https://reactrouter.com/)
- Backend / Database: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- Icons: [Lucide React](https://lucide.dev/)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- npm (comes with Node.js)
- A [Supabase](https://supabase.com/) project set up.

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd benthel-attendance
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:

   Create a `.env` file in the root directory and add your Supabase credentials. You can find these in your Supabase project settings.

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The application should now be running at `http://localhost:5173`.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Project Structure

```
src/
├── pages/                  # Application pages/views
│   ├── AdminDashboard.jsx  # Dashboard for Admin users
│   ├── Login.jsx           # Authentication entry point
│   ├── SignUp.jsx          # User registration
│   ├── StudentDashboard.jsx# Dashboard for Students and Parents
│   └── TeacherDashboard.jsx# Dashboard for Teachers
├── App.jsx                 # Main application component & Routing logic
├── supabaseClient.js       # Supabase client initialization
└── main.jsx                # Entry point
```

## Database Schema (Supabase)

This application relies on a profiles table in Supabase to handle user roles. Ensure your database has a table structured similar to this:

- Table: profiles
- Columns:
  - id (uuid, primary key, references auth.users.id)
  - role (text) - Values: 'admin', 'teacher', 'student', 'parent'
  - ...other user details

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---

Note: This project is currently in development.
