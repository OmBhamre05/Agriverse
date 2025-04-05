import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:opacity-75 transition-opacity"
            >
              <img
                className="h-10 w-auto"
                src="/logo.png"
                alt="AgriVerse Logo"
              />
              <span className="text-lg font-semibold text-green-600 hidden sm:block">
                AgriVerse
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:space-x-1">
            <Link
              to="/home"
              className="px-3 py-2 text-sm font-medium text-gray-900 rounded-lg
                relative after:absolute after:bottom-0 after:left-0 after:h-0.5
                after:w-full after:origin-left after:scale-x-100 after:bg-green-500
                hover:bg-green-50 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg
                relative after:absolute after:bottom-0 after:left-0 after:h-0.5
                after:w-full after:origin-left after:scale-x-0 after:bg-green-500
                hover:text-gray-900 hover:bg-green-50 after:transition-transform
                hover:after:scale-x-100 transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/blogs"
              className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg
                relative after:absolute after:bottom-0 after:left-0 after:h-0.5
                after:w-full after:origin-left after:scale-x-0 after:bg-green-500
                hover:text-gray-900 hover:bg-green-50 after:transition-transform
                hover:after:scale-x-100 transition-colors"
            >
              Blogs
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-green-500 ring-offset-2 hover:ring-green-600 transition-all">
              <AvatarFallback className="bg-green-500 text-white font-medium">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
