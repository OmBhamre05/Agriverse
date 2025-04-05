import Navbar from "@/components/Navbar";
import CourseCarousel from "@/components/CourseCarousel";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder data until we integrate with backend
const featuredCourses = [
  {
    id: 1,
    title: "Introduction to Organic Farming",
    description: "Learn the basics of organic farming and sustainable agriculture practices.",
    thumbnail: "/placeholder.jpeg"
  },
  {
    id: 2,
    title: "Advanced Crop Management",
    description: "Master the techniques of crop rotation and soil management.",
    thumbnail: "/placeholder.jpeg"
  },
  {
    id: 3,
    title: "Sustainable Pest Control",
    description: "Natural and effective methods to protect your crops from pests.",
    thumbnail: "/placeholder.jpeg"
  },
  {
    id: 4,
    title: "Water Conservation in Agriculture",
    description: "Learn efficient irrigation techniques and water management.",
    thumbnail: "/placeholder.jpeg"
  },
  {
    id: 5,
    title: "Modern Farming Technologies",
    description: "Explore the latest technological advancements in agriculture.",
    thumbnail: "/placeholder.jpeg"
  }
];

const topPicks = [
  {
    id: 6,
    title: "Soil Health Management",
    description: "Understanding soil composition and maintenance.",
    thumbnail: "/placeholder.jpeg"
  },
  {
    id: 7,
    title: "Greenhouse Farming",
    description: "Setup and manage successful greenhouse operations.",
    thumbnail: "/placeholder.jpeg"
  },
  {
    id: 8,
    title: "Agricultural Marketing",
    description: "Learn to market and sell your agricultural products.",
    thumbnail: "/placeholder.jpeg"
  },
  {
    id: 9,
    title: "Farm Business Management",
    description: "Essential business skills for modern farmers.",
    thumbnail: "/placeholder.jpeg"
  },
  {
    id: 10,
    title: "Climate-Smart Agriculture",
    description: "Adapt your farming practices to climate change.",
    thumbnail: "/placeholder.jpeg"
  }
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AgriVerse Learning
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover expert-led courses in agriculture and enhance your farming knowledge
          </p>
        </section>

        {/* Featured Courses */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
              <p className="text-gray-600 mt-1">Explore our most popular courses</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 group">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="px-8">
            <CourseCarousel courses={featuredCourses} />
          </div>
        </section>

        {/* Top Picks */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Top Picks for You</h2>
              <p className="text-gray-600 mt-1">Based on your interests</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 group">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {topPicks.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="px-4 py-2 bg-white text-gray-900 rounded-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300 font-medium text-sm hover:bg-gray-100">
                        View Course
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
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
                        1.2k views
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        4.5
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
