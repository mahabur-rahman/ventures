# Murmur - Twitter-like Social Media Application

A full-stack social media application similar to Twitter, built with NestJS, React, TypeScript, and MySQL.

## 🚀 Features

### User Features
- ✅ User registration and authentication (JWT)
- ✅ Create, view, and delete murmurs (tweets)
- ✅ Like/unlike murmurs
- ✅ Follow/unfollow other users
- ✅ View timeline with murmurs from followed users
- ✅ User profiles with statistics (murmurs count, followers, following)
- ✅ Pagination (10 items per page)

### Technical Features
- ✅ RESTful API with NestJS
- ✅ JWT-based authentication
- ✅ TypeORM for database management
- ✅ React with TypeScript
- ✅ Tailwind CSS for styling
- ✅ Docker support for MySQL
- ✅ CORS enabled for frontend-backend communication

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Database
- **Database**: MySQL 8.0
- **Container**: Docker Compose

## 📋 Prerequisites

- Node.js (v20.x.x)
- npm or yarn
- Docker and Docker Compose

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ventures
```

### 2. Setup Database

```bash
cd db
docker compose build
docker compose up -d
cd ..
```

Verify database is running:
```bash
docker compose ps
```

### 3. Setup Backend (Server)

```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run start:dev
```

The server will run on `http://localhost:3001`

### 4. Setup Frontend (Client)

```bash
cd src
yarn install

# Start development server
yarn dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
ventures/
├── db/                     # Database Docker configuration
│   ├── docker-compose.yml
│   ├── init.sql
│   └── README.md
├── server/                 # Backend (NestJS)
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── entities/      # TypeORM entities
│   │   ├── me/            # Current user endpoints
│   │   ├── murmurs/       # Murmur module
│   │   ├── users/         # Users module
│   │   ├── common/        # Common utilities
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── src/                    # Frontend (React)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Murmurs
- `GET /api/murmurs` - Get timeline (authenticated)
- `GET /api/murmurs/:id` - Get murmur by ID
- `POST /api/me/murmurs` - Create murmur (authenticated)
- `DELETE /api/me/murmurs/:id` - Delete own murmur (authenticated)
- `POST /api/murmurs/:id/like` - Like murmur (authenticated)
- `DELETE /api/murmurs/:id/like` - Unlike murmur (authenticated)

### Users
- `GET /api/me` - Get current user (authenticated)
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/murmurs` - Get user's murmurs
- `POST /api/users/:id/follow` - Follow user (authenticated)
- `DELETE /api/users/:id/follow` - Unfollow user (authenticated)

## 🗄️ Database Schema

### Users
```sql
- id (PK)
- username (unique)
- email (unique)
- password (hashed)
- name
- bio
- createdAt
- updatedAt
```

### Murmurs
```sql
- id (PK)
- content
- userId (FK -> users.id)
- createdAt
- updatedAt
```

### Follows
```sql
- id (PK)
- followerId (FK -> users.id)
- followingId (FK -> users.id)
- createdAt
```

### Likes
```sql
- id (PK)
- userId (FK -> users.id)
- murmurId (FK -> murmurs.id)
- createdAt
```

## 🎯 Usage

1. **Register a new account** at `/register`
2. **Login** at `/login`
3. **Create murmurs** from the timeline
4. **Follow other users** to see their murmurs in your timeline
5. **Like murmurs** by clicking the heart icon
6. **View profiles** to see user statistics and their murmurs
7. **Delete your own murmurs** from your profile

## 🔧 Development

### Backend Development
```bash
cd server
npm run start:dev       # Start with hot reload
npm run build          # Build for production
npm run test           # Run tests
```

### Frontend Development
```bash
cd src
yarn dev              # Start development server
yarn build            # Build for production
yarn preview          # Preview production build
```

### Database Management
```bash
cd db
docker compose up -d    # Start database
docker compose down     # Stop database
docker compose logs -f  # View logs
```

## 📝 Environment Variables

### Server (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=murmur_app
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
```

## 🤝 Contributing

This is a test project. For any questions, please contact the project administrators.

## 📄 License

This project is part of a coding assessment.

## ✨ Implemented Features Checklist

- [x] User authentication (register/login)
- [x] Create murmurs (max 280 characters)
- [x] Delete own murmurs
- [x] Like/unlike murmurs
- [x] Follow/unfollow users
- [x] Timeline with followed users' murmurs
- [x] Pagination (10 murmurs per page)
- [x] User profiles with statistics
- [x] View individual murmur details
- [x] Protected routes (authentication required)
- [x] CORS enabled
- [x] Docker database setup
- [x] Comprehensive documentation

## 🎨 Screenshots

The application includes:
- Clean, responsive UI with Tailwind CSS
- Navbar with authentication state
- Timeline with create murmur form
- User profiles with follow buttons
- Murmur cards with like buttons
- Pagination controls
