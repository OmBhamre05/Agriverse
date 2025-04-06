import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const MentorStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <Card>
      <CardContent className="p-6">
        <div className="text-sm font-medium text-gray-500">Total Courses</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">{stats.totalCourses}</div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="text-sm font-medium text-gray-500">Total Students</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">{stats.totalStudents}</div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6">
        <div className="text-sm font-medium text-gray-500">Total Earnings</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">₹{stats.totalEarnings}</div>
      </CardContent>
    </Card>
  </div>
);

const CourseCard = ({ course }) => (
  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
    <CardContent className="p-0">
      <div className="relative overflow-hidden">
        <img
          src={`http://localhost:5000/uploads/thumbnails/${course.thumbnail}`}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Link 
            to={`/mentor/courses/${course._id}/edit`}
            className="px-4 py-2 bg-white text-gray-900 rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 font-medium text-sm hover:bg-gray-100"
          >
            Edit Course
          </Link>
          <Link 
            to={`/mentor/courses/${course._id}`}
            className="px-4 py-2 bg-green-500 text-white rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 font-medium text-sm hover:bg-green-600"
          >
            View Details
          </Link>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {course.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {course.views || 0} views
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {course.rating || 0}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [coursesRes, statsRes] = await Promise.all([
          axiosInstance.get("/courses/mentor"),
          axiosInstance.get("/mentor/stats"),
        ]);
        setCourses(coursesRes.data);
        setStats(statsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your courses and track performance</p>
          </div>
          <Button
            onClick={() => navigate("/mentor/upload-course")}
            className="bg-green-500 hover:bg-green-600"
          >
            Upload New Course
          </Button>
        </div>

        <MentorStats stats={stats} />

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Courses</h2>
          {courses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 mb-4">You haven't uploaded any courses yet</p>
                <Button
                  onClick={() => navigate("/mentor/upload-course")}
                  variant="outline"
                >
                  Upload Your First Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MentorDashboard;