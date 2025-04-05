import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCourse(response.data.data.course);
                setVideos(response.data.data.course.videos);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch course details.');
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    const handleDeleteVideo = async (videoId) => {
        try {
            await axios.delete(`http://localhost:5000/api/courses/${courseId}/videos/${videoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setVideos(videos.filter(video => video.id !== videoId));
        } catch (err) {
            alert('Failed to delete video.');
        }
    };

    const handleAddVideo = async () => {
        // Implement video addition logic
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="course-detail">
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>Earnings: ${course.earnings}</p>
            <p>Price: ${course.price}</p>

            <h3>Videos</h3>
            <ul>
                {videos.map(video => (
                    <li key={video.id}>
                        <p>{video.title}</p>
                        <button onClick={() => handleDeleteVideo(video.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleAddVideo}>Add Video</button>
        </div>
    );
};

export default CourseDetail;