# Admin Dashboard Backend

This is a Node.js Express backend for the admin dashboard. It connects to MongoDB Atlas using Mongoose and provides REST API endpoints for Admin, Booking, Event, and User models.

## Features
- MongoDB Atlas connection via environment variable
- Models: Admin, Booking, Event, User
- REST API routes for each model
- Ready for integration with frontend dashboard

## Setup
1. Copy your MongoDB Atlas connection string to `.env` as `MONGODB_URI`.
2. Run `npm install` to install dependencies.
3. Start the server with `npm run dev`.

## Folder Structure
- `/models` - Mongoose models
- `/routes` - Express routes
- `app.js` - Main server file
- `.env` - Environment variables

## API Endpoints
- `GET /api/admins` - List admins
- `GET /api/bookings` - List bookings
- `GET /api/events` - List events
- `GET /api/users` - List users

---
