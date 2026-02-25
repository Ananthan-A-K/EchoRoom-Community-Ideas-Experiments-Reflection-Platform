# EchoRoom Backend

Backend service for EchoRoom, built with Express + TypeScript.

## Current Status

The backend is no longer a minimal scaffold. It currently includes:

- Auth system with JWT access tokens and refresh tokens
- Prisma + MongoDB integration for auth persistence (`User`, `RefreshToken`)
- Domain APIs for ideas, comments, experiments, outcomes, and reflections
- State transition and optimistic-locking rules for ideas

## Important Data Behavior

Storage is currently hybrid:

- Persistent in MongoDB (via Prisma): auth users and refresh tokens
- In-memory only: ideas, comments, experiments, outcomes, reflections

On restart, in-memory data is reset.

## Tech Stack

- Node.js + TypeScript
- Express
- Prisma ORM
- MongoDB
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)

## Run Locally

```bash
cd backend
npm install
npm run prisma:generate
npm run dev