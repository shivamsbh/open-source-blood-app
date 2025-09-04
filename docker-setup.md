# 🐳 Docker Setup for Blood Bank Management System

## Quick Start

### 1. Prerequisites
- Docker installed on your machine
- Docker Compose installed

### 2. Start the Application
```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up

# Or run in background
docker-compose up -d
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **MongoDB**: localhost:27017

## Services Overview

### 🗄️ MongoDB Container
- **Image**: mongo:7.0
- **Port**: 27017
- **Database**: bloodbank
- **Username**: admin
- **Password**: password123
- **Data**: Persisted in Docker volume `mongodb_data`

### 🚀 Backend Container
- **Port**: 8080
- **Environment**: Development with nodemon
- **Hot Reload**: Enabled via volume mounting
- **API Base**: http://localhost:8080/api/v1

### ⚛️ Frontend Container
- **Port**: 3000
- **Environment**: Development with hot reload
- **Hot Reload**: Enabled via volume mounting
- **App URL**: http://localhost:3000

## Docker Commands

### Basic Operations
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete database data)
docker-compose down -v

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Development Commands
```bash
# Rebuild containers (after code changes to Dockerfile)
docker-compose up --build

# Rebuild specific service
docker-compose build backend

# Execute commands in running container
docker-compose exec backend npm run seed
docker-compose exec mongodb mongosh bloodbank
```

### Database Operations
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Run database seeder
docker-compose exec backend npm run seed

# Backup database
docker-compose exec mongodb mongodump --host localhost --port 27017 --db bloodbank --out /backup

# Restore database
docker-compose exec mongodb mongorestore --host localhost --port 27017 --db bloodbank /backup/bloodbank
```

## Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb://admin:password123@mongodb:27017/bloodbank?authSource=admin
JWT_SECRET=bloodbank_super_secret_jwt_key_2024_secure
PORT=8080
DEV_MODE=development
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_BASEURL=http://localhost:8080/api/v1
CHOKIDAR_USEPOLLING=true
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
lsof -i :3000  # or :8080, :27017

# Kill the process
kill -9 <PID>
```

#### 2. Database Connection Issues
```bash
# Check if MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

#### 3. Frontend Not Loading
```bash
# Check if all services are running
docker-compose ps

# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
```

#### 4. Backend API Not Responding
```bash
# Check backend logs
docker-compose logs backend

# Check if backend can connect to MongoDB
docker-compose exec backend npm run test
```

### Clean Reset
```bash
# Stop everything and clean up
docker-compose down -v
docker system prune -f

# Start fresh
docker-compose up --build
```

## Development Workflow

### 1. Code Changes
- **Frontend**: Changes in `client/` folder are automatically reflected (hot reload)
- **Backend**: Changes in `backend/` folder are automatically reflected (nodemon)
- **Database**: Data persists between container restarts

### 2. Adding Dependencies
```bash
# Frontend dependencies
docker-compose exec frontend npm install <package-name>

# Backend dependencies  
docker-compose exec backend npm install <package-name>

# Or rebuild containers
docker-compose build
```

### 3. Database Management
```bash
# Seed initial data
docker-compose exec backend npm run seed

# Clear and reseed
docker-compose exec backend npm run seed:clear
```

## Production Notes

This setup is optimized for **local development**. For production:
- Use production MongoDB (Atlas or dedicated server)
- Build optimized React app
- Use nginx for serving static files
- Implement proper security measures
- Use Docker secrets for sensitive data

## Next Steps

1. **Test the setup**: Run `docker-compose up` and verify all services start
2. **Seed data**: Run the database seeder to populate initial data
3. **Development**: Start coding with hot reload enabled
4. **Production**: Create production Docker configuration when ready