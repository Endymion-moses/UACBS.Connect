# UACBS.Connect

UACBS.Connect is a university appointment management application designed to connect students, lecturers, and administrators in a campus environment. It supports student appointment requests, lecturer availability and request handling, notification delivery, and administrator oversight.

## What this app does

- Students can register, login, view lecturers, book appointments, see their appointment status, and receive notifications.
- Lecturers can register, login, set available time slots, review incoming appointment requests, approve or reject requests, and view their schedule.
- Administrators can manage users, departments, reports, and application settings.

## Key features

- Role-based authentication and authorization using JWT tokens
- Separate UI experiences for student, lecturer, and admin roles
- Appointment booking workflow with availability validation
- Lecturer availability management
- Notifications for appointment creation and status changes
- Prisma ORM backed by PostgreSQL

## Repository structure

- `client/` – React frontend built with Vite and Tailwind CSS
- `server/` – Express backend with Prisma ORM and PostgreSQL support
- `server/prisma/` – Prisma schema and migration history

## Technology stack

- Frontend: React, React Router DOM, Tailwind CSS, Vite
- Backend: Node.js 20+, Express, Prisma, PostgreSQL, JWT, bcryptjs
- Dev tools: nodemon, eslint, Vite

## User roles

- `STUDENT` – book appointments, view own appointments, receive notifications
- `LECTURER` – define availability, view appointment requests, approve/reject requests, receive notifications
- `ADMIN` – access admin dashboard, manage users, departments, reports, and settings

## Frontend overview

The frontend is located in `client/`. Important files:

- `client/src/App.jsx` – wraps the app with `AuthProvider`
- `client/src/routes/AppRoutes.jsx` – defines routes for student, lecturer, and admin
- `client/src/context/AuthContext.jsx` – handles authentication state and session management
- `client/src/pages/` – contains role-specific pages for student, lecturer, admin, and auth
- `client/src/layouts/` – shell layouts for each role view
- `client/src/services/` – API calls to the backend

## Backend overview

The backend is located in `server/`. Important files:

- `server/src/server.js` – main Express server setup, middleware, and route mounting
- `server/src/config/database.js` – Prisma client setup using PostgreSQL
- `server/src/middlewares/verifyToken.js` – protects routes by verifying JWT tokens
- `server/src/controllers/` – contains business logic for authentication, appointments, availability, notifications, users, and lecturers
- `server/src/routes/` – API route definitions

## API endpoints

### Authentication

- `POST /auth/register` – create a new account for student, lecturer, or admin
- `POST /auth/login` – authenticate and receive a JWT token
- `POST /auth/logout` – clear authentication cookie

### User profile

- `PUT /user/update` – update user profile data (protected)

### Lecturer discovery

- `GET /lecturer/lecturers` – fetch available lecturers (protected)

### Availability

- `GET /lecturer/availability/:id` – fetch availability by lecturer ID
- `PUT /lecturer/availability` – update current lecturer availability (protected)

### Appointments

- `POST /appointments/` – create a new appointment request (protected)
- `GET /appointments/mine` – get current student appointments (protected)
- `GET /appointments/lecturer/requests` – get appointment requests for current lecturer (protected)
- `PATCH /appointments/:id/status` – approve or reject an appointment (protected)
- `PATCH /appointments/:id/cancel` – cancel a pending appointment (protected)

### Notifications

- `GET /notifications/` – get current user notifications (protected)
- `PATCH /notifications/:id/read` – mark a notification as read (protected)

## Database models

The Prisma schema defines the following core models:

- `User` – stores global user credentials and role
- `StudentProfile` – student-specific profile details and appointments
- `LecturerProfile` – lecturer-specific profile details, availability, and appointments
- `AdminProfile` – admin profile linked to a user
- `Appointment` – stores booking requests with status and relations
- `Notification` – stores messages for users
- `LecturerAvailability` – stores lecturer availability slots by day and time

### Role enumerations

- `Role` – `STUDENT`, `LECTURER`, `ADMIN`
- `AppointmentStatus` – `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`

## Environment variables

The backend depends on environment variables in `server/.env` or the environment:

- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET` – secret used to sign JWT tokens
- `PORT` – server port (defaults to `5000` if unset)
- `NODE_ENV` – `development` or `production`

## Local development setup

1. Install dependencies:
   - `cd client && npm install`
   - `cd server && npm install`
2. Set backend environment variables in `server/.env`
3. Run the backend:
   - `cd server && npm run dev`
4. Run the frontend:
   - `cd client && npm run dev`

## Notes for developers

- The server uses cookie parsing and also accepts Bearer tokens in the `Authorization` header.
- The `verifyToken` middleware appends `req.user` with `{ id, role }` for protected routes.
- Student appointment creation verifies lecturer availability and uses a Prisma transaction to create both the appointment and notification.
- Lecturer availability is seeded with default slots if none exist yet.
- Profile updates support role-specific profile data plus optional password changes.

## Suggested improvements

- Add explicit API documentation with request/response examples
- Add role-based route guards on the frontend
- Add admin management APIs for departments and reports
- Add tests for backend controllers and frontend behavior
- Improve phone validation to support more international formats

## Summary

UACBS.Connect is a university campus appointment booking app that enables students, lecturers, and admins to manage schedules and communication. It is implemented as a React frontend with a Node/Express backend and a PostgreSQL database through Prisma.
