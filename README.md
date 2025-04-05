# Farmer Learning Platform

A learning platform where farmers can access educational courses and mentors can create and sell their courses.

## Project Structure
```
farmer-learning-platform/
├── backend/                # Backend server code
│   ├── models/            # Database models
│   ├── controllers/       # Route controllers
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── config/           # Configuration files
│   └── utils/            # Utility functions
└── frontend/             # Frontend code (to be added by frontend team)
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/farmer-learning-platform
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "User Name",
    "phone": "1234567890",
    "password": "password123",
    "role": 1  // 1 for farmer, 2 for mentor
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "phone": "1234567890",
    "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Response Format
All API responses follow this format:
```json
{
    "status": "success|fail|error",
    "data": {
        // Response data
    },
    "message": "Error message if any"
}
```

## For Frontend Team
1. The backend server runs on `http://localhost:5000`
2. All API endpoints are prefixed with `/api`
3. Protected routes require JWT token in Authorization header
4. CORS is enabled for frontend development

## Contributing
1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License
[MIT License](LICENSE)
