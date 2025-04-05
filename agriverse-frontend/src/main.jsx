import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MentorDashboard from './pages/MentorDashboard';
import CourseDetail from './pages/CourseDetail';
import SelectInterests from './pages/SelectInterests';
import Home from './pages/Home';


const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/mentor/dashboard", element: <MentorDashboard /> },
  { path: "/course-details", element: <CourseDetail /> },
  { path: "/select-interests", element: <SelectInterests /> },
  { path: "/home", element: <Home /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)