# PSE PDMS

Panoramic Synergy Enterprise Project Delivery Management System.

## Overview

This application is a modern enterprise project management system built with:

- Frontend: HTML5, CSS3, JavaScript (ES6)
- Backend: Node.js, Express.js
- Database: MySQL
- Authentication: JWT, bcrypt
- Architecture: MVC

## Features

- Secure login with role-based redirects
- JWT-protected API routes
- Role and permission middleware
- Project CRUD and dashboard views
- Audit logs and notifications
- Responsive modern UI

## Setup

1. Copy `.env.example` to `.env` and fill in database credentials.
2. Install dependencies:

```bash
npm install
```

3. Create the MySQL database:

```sql
CREATE DATABASE pse_pdms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Run migrations:

```bash
npm run migrate
```

5. Start the backend server:

```bash
npm run dev
```

6. Open the app in a browser using your local static host or file server for the frontend files.

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start server with nodemon
- `npm run migrate` - Create database tables and seed initial data

## API Endpoints

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/bootstrap`
- `GET /api/users`
- `PATCH /api/users/:id`
- `GET /api/projects`
- `POST /api/projects`
- `PATCH /api/projects/:id`
- `GET /api/audit`
- `GET /api/notifications`
- `POST /api/notifications`
- `PUT /api/notifications/:id/read`

## Default Users

After migration, seeded users include:

- admin@pse.com — General Admin
- hr@pse.com — HR
- coo@pse.com — COO
- sales@pse.com — Sales
- leadpm@pse.com — Lead Project Manager
- pm@pse.com — Project Manager
- consultant@pse.com — Consultant

Default password for seeded users: `Welcome@123`

## Notes

- The frontend currently uses local static assets and a config file that points to `http://localhost:4000/api`.
- Protect production secrets and use HTTPS for deployments.
