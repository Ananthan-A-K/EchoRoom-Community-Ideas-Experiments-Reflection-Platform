# EchoRoom Backend Setup Guide

A complete guide to setting up the EchoRoom backend with MongoDB, authentication, and permissions.

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Edit `backend/.env`:
```env
PORT=5000
DATABASE_URL="mongodb://localhost:27017/echoroom?authSource=admin"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

For MongoDB Atlas (cloud), use:
```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/echoroom?authSource=admin&retryWrites=true&w=majority"
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Push Schema to MongoDB
```bash
npm run prisma:push
```

This creates all required collections in MongoDB:
- users
- ideas
- experiments
- experiment_team
- outcomes
- reflections
- refresh_tokens

### 5. Start Development Server
```bash
npm run dev
```

Server runs at: http://localhost:5000

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Push schema to database |
| `npm run prisma:studio` | Open Prisma Studio |

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout user | No |

### Ideas

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/ideas` | List all ideas | No |
| GET | `/ideas/:id` | Get idea by ID | No |
| POST | `/ideas` | Create idea | Yes |
| PUT | `/ideas/:id` | Update idea | Yes |
| DELETE | `/ideas/:id` | Delete idea | Yes |

### Experiments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/experiments` | List all experiments | No |
| GET | `/experiments/:id` | Get experiment by ID | No |
| POST | `/experiments` | Create experiment | Yes |
| PUT | `/experiments/:id` | Update experiment | Yes |
| DELETE | `/experiments/:id` | Delete experiment | Yes |

### Outcomes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/outcomes` | List all outcomes | No |
| GET | `/outcomes/:id` | Get outcome by ID | No |
| POST | `/outcomes` | Create outcome | Yes |
| PUT | `/outcomes/:id` | Update outcome | Yes |
| DELETE | `/outcomes/:id` | Delete outcome | Yes |

### Reflections

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reflections` | List all reflections | No |
| GET | `/reflections/:id` | Get reflection by ID | No |
| POST | `/reflections` | Create reflection | Yes |
| PUT | `/reflections/:id` | Update reflection | Yes |
| DELETE | `/reflections/:id` | Delete reflection | Yes |

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"username","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Create Idea (with token)
```bash
curl -X POST http://localhost:5000/ideas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"title":"My Idea","description":"Idea description"}'
```

### List Ideas (public)
```bash
curl http://localhost:5000/ideas
```

## User Roles

| Role | Permissions |
|------|-------------|
| ADMIN | Full access to all resources and user management |
| MODERATOR | Create, read, update for all resources |
| MEMBER | Create, read, update own resources |
| GUEST | Read-only access to public content |

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── index.ts           # Express app entry point
│   ├── lib/
│   │   └── prisma.ts      # Database client
│   ├── middleware/
│   │   ├── auth.ts        # JWT authentication
│   │   └── permissions.ts # Role-based access control
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── ideas.routes.ts
│   │   ├── experiments.routes.ts
│   │   ├── outcomes.routes.ts
│   │   └── reflections.routes.ts
│   └── services/
│       ├── auth.service.ts
│       ├── ideas.service.ts
│       ├── experiments.service.ts
│       ├── outcomes.service.ts
│       └── reflections.service.ts
├── .env                   # Environment variables
├── package.json
└── tsconfig.json
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check DATABASE_URL in .env
- Verify MongoDB credentials

### Token Expiry
- Access tokens expire in 15 minutes
- Use refresh token endpoint to get new access token

### Prisma Errors
- Run `npm run prisma:generate` after schema changes
- Run `npm run prisma:push` to sync database schema

## Production Deployment

1. Set environment variables:
```env
NODE_ENV=production
DATABASE_URL="mongodb+srv://..."
JWT_SECRET="very-long-random-secret"
```

2. Build and start:
```bash
npm run build
npm run start
```
