import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await axiosInstance.get(`/courses/${courseId}`);
      setCourse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch course");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("video", file);

      await axiosInstance.post(`/courses/${courseId}/videos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Video added successfully");
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add video");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await axiosInstance.delete(`/courses/${courseId}`);
      toast.success("Course deleted successfully");
      navigate("/mentor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete course");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await axiosInstance.delete(`/courses/${courseId}/videos/${videoId}`);
      toast.success("Video deleted successfully");
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete video");
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-600">{error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-2 text-lg text-gray-600">{course.description}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-2xl font-semibold text-gray-900">₹{course.price}</div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span>{course.rating || 0}</span>
                <span className="text-gray-500">({course.reviews?.length || 0} reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate(`/mentor/courses/${courseId}/edit`)}
              variant="outline"
            >
              Edit Course
            </Button>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="destructive"
            >
              Delete Course
            </Button>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player and List */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                  {course.videos && course.videos.length > 0 && (
                    <video
                      src={`http://localhost:5000/uploads/videos/${course.videos[0]}`}
                      controls
                      className="w-full h-full"
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Course Videos</h2>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleAddVideo}
                        disabled={uploading}
                      />
                      <Button variant="outline" disabled={uploading}>
                        {uploading ? "Uploading..." : "Add Video"}
                      </Button>
                    </label>
                  </div>
                  {course.videos?.map((video, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <div>Video {index + 1}</div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteVideo(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Student Reviews</h2>
                {course.reviews?.length === 0 ? (
                  <p className="text-gray-500">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {course.reviews?.map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>
                                {i < review.rating ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          <div className="text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Delete Course</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this course? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteCourse}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseDetails;
