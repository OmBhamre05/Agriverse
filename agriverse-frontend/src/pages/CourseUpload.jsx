import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";

const CourseUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    language: "",
    state: "draft",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };

      video.onerror = () => {
        reject('Error loading video file');
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const duration = await calculateVideoDuration(file);
        setFormData(prev => ({
          ...prev,
          totalDuration: duration
        }));
        setVideo(file);
      } catch (err) {
        toast.error('Error reading video file');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!video) {
        toast.error('Please select a video file');
        return;
      }
      if (!thumbnail) {
        toast.error('Please select a thumbnail image');
        return;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append("thumbnail", thumbnail);
      formDataToSend.append("video", video);

      const response = await axiosInstance.post("/courses", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success('Course uploaded successfully!');
      navigate("/mentor/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload New Course</h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter course title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter course description"
                required
                className="h-32"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter course price"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  name="language"
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, language: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Course Thumbnail</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  required
                  className="flex-1"
                />
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Course Video</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                required
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Course"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CourseUpload;
