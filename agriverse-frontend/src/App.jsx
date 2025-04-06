import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import SelectInterests from './pages/SelectInterests'
import MentorDashboard from './pages/MentorDashboard'
import CourseUpload from './pages/CourseUpload'
import { Toaster } from 'sonner'

const LandingPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
    <h1 className="text-5xl font-bold mb-4 text-green-800">Welcome to AgriVerse</h1>
    <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
      Your journey to modern farming starts here. Learn from experts and grow with our community.
    </p>
    <div className="space-x-4">
      <Button asChild variant="default" className="bg-green-600 hover:bg-green-700">
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
        <Link to="/register">Register</Link>
      </Button>
    </div>
  </div>
)

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-interests" element={<SelectInterests />} />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/mentor/upload-course" element={<CourseUpload />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App