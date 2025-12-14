# Murmur Backend API

A Twitter-like social media application backend built with NestJS, TypeORM, and MySQL.

## Features

- User authentication with JWT
- Create, read, and delete murmurs (tweets)
- Like/unlike murmurs
- Follow/unfollow users
- Timeline with pagination
- User profiles with statistics

## Tech Stack

- **Framework**: NestJS
- **Database**: MySQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the server directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=murmur_app
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
```

## Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Murmurs
- `GET /api/murmurs` - Get timeline (requires auth)
- `GET /api/murmurs/:id` - Get murmur by ID
- `POST /api/me/murmurs` - Create a murmur (requires auth)
- `DELETE /api/me/murmurs/:id` - Delete own murmur (requires auth)
- `POST /api/murmurs/:id/like` - Like a murmur (requires auth)
- `DELETE /api/murmurs/:id/like` - Unlike a murmur (requires auth)

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/murmurs` - Get user's murmurs
- `POST /api/users/:id/follow` - Follow a user (requires auth)
- `DELETE /api/users/:id/follow` - Unfollow a user (requires auth)
- `GET /api/me` - Get current user (requires auth)

## Database Schema

### Users
- id, username, email, password, name, bio
- timestamps (createdAt, updatedAt)

### Murmurs
- id, content, userId
- timestamps (createdAt, updatedAt)

### Follows
- id, followerId, followingId
- timestamp (createdAt)

### Likes
- id, userId, murmurId
- timestamp (createdAt)
