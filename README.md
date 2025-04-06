# Farmer Learning Platform

drive link : https://drive.google.com/drive/folders/1J8eWjSdd9tyU20yzI8dM4Mbj1vNeu05Q?usp=sharing

A learning platform where farmers can access educational courses and mentors can create and sell their courses.

## Project Structure
```
farmer-learning-platform/
├── backend/                # Backend server code
│   ├── models/            # Database models
│   │   ├── User.js        # User model (farmers & mentors)
│   │   ├── Course.js      # Course model
│   │   └── Purchase.js    # Purchase & enrollment model
│   ├── controllers/       # Route controllers
│   │   ├── authController.js    # Authentication
│   │   ├── courseController.js  # Course management
│   │   ├── mentorController.js  # Mentor features
│   │   └── purchaseController.js# Purchase handling
│   ├── routes/           # API routes
│   │   ├── auth.js       # Auth routes
│   │   ├── courses.js    # Course routes
│   │   ├── mentors.js    # Mentor routes
│   │   └── purchases.js  # Purchase routes
│   └── middlewares/      # Custom middlewares
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### API Endpoints

#### 1. Authentication
##### Register User
```http
POST /auth/register
Content-Type: application/json

{
    "name": "User Name",
    "phone": "9876543210",     // 10 digits
    "password": "password123",  // min 6 characters
    "role": 1                  // 1: Farmer, 2: Mentor
}

Response:
{
    "status": "success",
    "token": "jwt_token",
    "data": {
        "user": {
            "name": "User Name",
            "phone": "9876543210",
            "role": 1
        }
    }
}
```

##### Login
```http
POST /auth/login
Content-Type: application/json

{
    "phone": "9876543210",
    "password": "password123"
}

Response: Same as register
```

#### 2. Courses (Public)
##### List All Courses
```http
GET /courses

Query Parameters:
- state: Filter by state
- language: Filter by language
- minPrice: Minimum price
- maxPrice: Maximum price
- minRating: Minimum rating
- sort: Sort field (e.g., "price,-createdAt")

Response:
{
    "status": "success",
    "results": 10,
    "data": {
        "courses": [{
            "title": "Course Title",
            "description": "Description",
            "price": 999,
            "state": "Punjab",
            "language": "Punjabi",
            "thumbnail": "url",
            "averageRating": 4.5,
            "mentor": {
                "name": "Mentor Name",
                "expertise": ["topic1", "topic2"]
            }
        }]
    }
}
```

##### Get Single Course
```http
GET /courses/:courseId

Response:
{
    "status": "success",
    "data": {
        "course": {
            // Same as above plus:
            "videos": [{
                "title": "Video Title",
                "description": "Description",
                "duration": 300,
                "order": 1
            }],
            "ratings": [{
                "rating": 5,
                "review": "Great course!",
                "user": {
                    "name": "User Name"
                }
            }]
        }
    }
}
```

#### 3. Mentor Features (Protected - Role 2)
##### Create Course
```http
POST /courses
Content-Type: application/json

{
    "title": "Course Title",
    "description": "Course Description",
    "price": 999,
    "state": "Punjab",
    "language": "Punjabi",
    "thumbnail": "image_url"
}
```

##### Add Course Video
```http
POST /courses/:courseId/videos
Content-Type: application/json

{
    "title": "Video Title",
    "description": "Video Description",
    "url": "video_url",
    "duration": 300,  // in seconds
    "order": 1
}
```

##### Update Course Status
```http
PATCH /courses/:courseId/status
Content-Type: application/json

{
    "status": "published"  // draft, published, archived
}
```

##### Get Mentor Profile
```http
GET /mentors/profile

Response:
{
    "status": "success",
    "data": {
        "mentor": {
            "name": "Mentor Name",
            "expertise": ["topic1", "topic2"]
        },
        "stats": {
            "totalCourses": 5,
            "totalStudents": 100,
            "earnings": 50000,
            "publishedCourses": 3,
            "averageRating": 4.5
        },
        "courses": [/* list of courses */]
    }
}
```

#### 4. Student Features (Protected - Role 1)
##### Purchase Course
```http
POST /purchases/courses/:courseId
Content-Type: application/json

{
    "paymentMethod": "card"  // card, upi, netbanking
}

Response:
{
    "status": "success",
    "data": {
        "purchase": {
            "transactionId": "TXN123",
            "amount": 999,
            "status": "pending"
        }
    }
}
```

##### Confirm Purchase
```http
POST /purchases/confirm/:transactionId

Response:
{
    "status": "success",
    "data": {
        "purchase": {
            "status": "completed",
            "course": {/* course details */}
        }
    }
}
```

##### Get Purchased Courses
```http
GET /purchases/my-courses

Response:
{
    "status": "success",
    "data": {
        "purchases": [{
            "course": {/* course details */},
            "progress": {
                "completedVideos": ["video1", "video2"],
                "lastWatched": {
                    "video": "video2",
                    "timestamp": 120
                },
                "completionPercentage": 60
            }
        }]
    }
}
```

##### Update Course Progress
```http
POST /purchases/progress/:courseId
Content-Type: application/json

{
    "videoId": "video_id",
    "timestamp": 120,
    "completed": true
}
```

### Error Responses
All endpoints return error responses in this format:
```json
{
    "status": "fail",
    "message": "Error description"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Frontend Integration Guide

### Getting Started
1. Install and configure a REST client (e.g., axios)
2. Set up the base URL in your configuration
3. Create an authentication service to handle tokens

### Best Practices
1. Always handle both success and error responses
2. Store the JWT token securely (e.g., in HttpOnly cookies)
3. Implement token refresh mechanism
4. Add loading states for async operations
5. Implement proper form validation before making API calls
6. Cache responses when appropriate
7. Implement proper error handling and user feedback

### Authentication Flow
1. User registers/logs in
2. Store the received token
3. Include token in all subsequent requests
4. Handle 401 errors by redirecting to login

### Course Purchase Flow
1. User browses courses (public endpoint)
2. Views course details (public endpoint)
3. Initiates purchase (protected endpoint)
4. Confirms payment (protected endpoint)
5. Accesses course content (protected endpoint)

### Video Progress Tracking
1. Send regular progress updates
2. Mark videos as completed
3. Update last watched position

### Testing
Use Postman or similar tools to test the API. Remember to:
1. Register/login to get the JWT token
2. Include the token in the Authorization header
3. Use the correct Content-Type header for POST/PATCH requests
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
>>>>>>> 2391381f6b1a3893e12f025b71d455269613388b
