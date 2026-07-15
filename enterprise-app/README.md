# PSE Enterprise Project Management System

This repository contains a modern enterprise-grade Project Management System scaffold for Panoramic Synergy (PSE). It includes a Node.js backend, Express APIs, MySQL database models, JWT authentication, role-based access control, and starter seed data.

## Features

- Login with email/password
- JWT authentication and role middleware
- General Admin, HR, HTD, COO, Lead PM, Project Manager, Sales, Consultant, Viewer roles
- User management APIs
- Project CRUD and status management
- Report filters
- Audit log middleware
- Express security middleware: Helmet, rate limiting, CORS
- Sequelize MySQL data models

## Tech Stack

- Frontend: HTML5, CSS3, Bootstrap 5, JavaScript ES6, Chart.js, DataTables, Font Awesome
- Backend: Node.js, Express.js, Sequelize
- Database: MySQL
- Auth: JWT, bcrypt
- Architecture: MVC

## Setup

1. Copy `.env.example` to `.env` and set your database credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database:
   ```bash
   npm run seed
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `POST /api/users/:id/disable`
- `POST /api/users/:id/reset-password`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `POST /api/projects/:id/status`
- `GET /api/reports`

## Notes

- The current scaffold includes the API backend and database models.
- Frontend pages can be added under `src/public` or integrated with the existing static UI in the parent workspace.
- Ensure your `.env` contains a strong `JWT_SECRET`.
