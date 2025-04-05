import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const farmingCategories = [
  {
    id: 1,
    title: "Organic Farming",
    description: "Learn sustainable and chemical-free farming methods",
    icon: "🌱"
  },
  {
    id: 2,
    title: "Crop Management",
    description: "Master the art of crop rotation and maintenance",
    icon: "🌾"
  },
  {
    id: 3,
    title: "Livestock Management",
    description: "Expert guidance on animal husbandry",
    icon: "🐄"
  },
  {
    id: 4,
    title: "Smart Agriculture",
    description: "Modern farming with technology and IoT",
    icon: "🤖"
  },
  {
    id: 5,
    title: "Soil Management",
    description: "Understanding and improving soil health",
    icon: "🌍"
  },
  {
    id: 6,
    title: "Water Conservation",
    description: "Efficient irrigation and water management",
    icon: "💧"
  },
  {
    id: 7,
    title: "Pest Control",
    description: "Natural and integrated pest management",
    icon: "🐛"
  },
  {
    id: 8,
    title: "Agricultural Marketing",
    description: "Learn to market and sell your produce",
    icon: "📊"
  }
];

const SelectInterests = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (title) => {
    setSelectedInterests(prev => {
      if (prev.includes(title)) {
        return prev.filter(i => i !== title);
      }
      return [...prev, title];
    });
  };

  const handleSubmit = async () => {
    if (selectedInterests.length < 3) {
      toast.error("Please select at least 3 areas of interest");
      return;
    }

    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?.id;
      if (!userId) {
        throw new Error("User not found");
      }

      await axiosInstance.post("/auth/interests", {
        interests: selectedInterests
      });

      toast.success("Preferences saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
            Choose Your Areas of Interest
          </h2>
          <p className="text-lg text-gray-600">
            Select at least 3 categories to personalize your learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {farmingCategories.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedInterests.includes(category.title)
                  ? "ring-2 ring-blue-500 shadow-lg"
                  : ""
              }`}
              onClick={() => toggleInterest(category.title)}
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            {selectedInterests.length} of 3 minimum selections
          </p>
          <Link to="/home">
          <Button
            onClick={handleSubmit}
            disabled={selectedInterests.length < 3 || loading}
            
            className="w-full max-w-md"
          >
            {loading ? "Saving..." : "Get Started"}
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SelectInterests;
