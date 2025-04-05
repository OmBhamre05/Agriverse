# Backend - Farmer Learning Platform

## Directory Structure
```
backend/
├── models/          # MongoDB models
├── controllers/     # Business logic
├── routes/         # API routes
├── middlewares/    # Custom middlewares
├── config/         # Configuration files
└── utils/          # Utility functions
```

## Available Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile (Protected)

### Response Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farmer-learning-platform
JWT_SECRET=your_jwt_secret_key
```
