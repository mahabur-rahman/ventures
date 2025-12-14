# Database Configuration

MySQL 8.0 database setup using Docker Compose.

## Setup

```bash
# Build and start the database
docker compose build
docker compose up -d

# Check if the database is running
docker compose ps

# View logs
docker compose logs -f

# Stop the database
docker compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker compose down -v
```

## Connection Details

- **Host**: localhost
- **Port**: 3306
- **Database**: murmur_app
- **Root Password**: root
- **User**: murmur_user
- **Password**: murmur_pass

## Database Schema

The database schema is automatically created by TypeORM synchronize feature in the NestJS application.

Tables:
- `users` - User accounts and profiles
- `murmurs` - User posts/tweets
- `follows` - User follow relationships
- `likes` - Murmur likes
