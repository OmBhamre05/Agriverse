# AgriSatva Backend

Backend server for the AgriSatva web application, a comprehensive farmer profile system with learning modules and verification.

## Features

- 🌱 Farmer Profile Management
- 📚 Learning Modules System
- ✅ Progress Tracking
- 🎯 Verification System
- 🏪 Marketplace Integration

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- Multer for File Uploads

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agrisatva-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration
   ```bash
   cp .env.example .env
   ```

4. **Create required directories**
   ```bash
   mkdir -p uploads/proofs
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login

### Learning Module
- `GET /api/learning/modules` - Get all learning modules
- `GET /api/learning/progress` - Get user's learning progress
- `POST /api/learning/complete-video/:videoId` - Mark video as completed
- `POST /api/learning/submit-proof/:videoId` - Submit proof for verification

### Farmer
- `GET /api/farmer/profile` - Get farmer profile
- `PUT /api/farmer/profile` - Update farmer profile
- `GET /api/farmer/verification-status` - Get verification status

## Progress & Verification System

### Progress Calculation
- Video completion: 60% weightage
- Proof submission: 40% weightage
- Total verification score = (progress_score × 0.6) + (proof_score × 0.4)

### Verification Status
- Score < 50: Unverified
- Score ≥ 50: Verified

## Directory Structure

```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── config/          # Configuration files
├── uploads/         # File uploads (gitignored)
│   └── proofs/     # Proof submissions
└── server.js       # Entry point
```

## For Frontend Integration

1. **Authentication Headers**
   ```javascript
   headers: {
     'Authorization': 'Bearer YOUR_JWT_TOKEN'
   }
   ```

2. **File Upload Format**
   ```javascript
   // For proof submission
   const formData = new FormData();
   formData.append('proof', file);
   
   await axios.post('/api/learning/submit-proof/videoId', formData, {
     headers: {
       'Content-Type': 'multipart/form-data',
       'Authorization': `Bearer ${token}`
     }
   });
   ```

3. **Progress Tracking**
   - Initialize progress: Call `GET /api/learning/progress`
   - After video completion: Call `POST /api/learning/complete-video/:videoId`
   - Submit proof: Call `POST /api/learning/submit-proof/:videoId`
   - Check verification: Call `GET /api/farmer/verification-status`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
