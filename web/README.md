# Murmur Frontend

A Twitter-like social media application frontend built with React, TypeScript, and Tailwind CSS.

## Features

- User authentication (Login/Register)
- Timeline with pagination
- Create and delete murmurs
- Like/unlike murmurs
- Follow/unfollow users
- User profiles
- Real-time updates

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Installation

```bash
npm install
```

## Running the App

```bash
# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/      # Reusable components
│   ├── Navbar.tsx
│   ├── MurmurCard.tsx
│   ├── CreateMurmur.tsx
│   └── ProtectedRoute.tsx
├── context/         # React context providers
│   └── AuthContext.tsx
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Timeline.tsx
│   ├── MurmurDetail.tsx
│   └── UserProfile.tsx
├── services/        # API service layer
│   ├── api.ts
│   ├── auth.service.ts
│   ├── murmur.service.ts
│   └── user.service.ts
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Environment Setup

Make sure the backend API is running on `http://localhost:3001`

## Features Implementation

### Authentication
- JWT-based authentication
- Protected routes
- Persistent login with localStorage

### Timeline
- Displays murmurs from followed users
- Pagination (10 murmurs per page)
- Create new murmurs
- Like/unlike functionality

### User Profiles
- View user information
- Follow/unfollow users
- View user's murmurs
- Delete own murmurs

### Murmur Detail
- View individual murmur
- Like/unlike
- Delete (if owner)
