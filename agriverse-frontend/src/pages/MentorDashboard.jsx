import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Component to display educator details
const EducatorDetails = () => {
    const [educator, setEducator] = useState({ name: '', totalCourses: 0, totalEarnings: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEducatorDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/mentors/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setEducator(response.data.data.mentor);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch educator details.');
                setLoading(false);
            }
        };
        fetchEducatorDetails();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="educator-details">
            <h2>{educator.name}</h2>
            <p>Total Courses: {educator.totalCourses}</p>
            <p>Total Earnings: ${educator.totalEarnings}</p>
        </div>
    );
};

// Component to display individual course details
const CourseTitle = ({ title, courseId }) => (
    <Link to={`/courses/${courseId}`} className="course-title">
        {title}
    </Link>
);

// Component to display list of courses
const CoursesList = ({ courses }) => (
    <div className="courses-list">
        {courses.map(course => (
            <div key={course.id} className="course-item">
                <CourseTitle title={course.title} courseId={course.id} />
                <p>Rating: {course.rating}</p>
                <p>Earnings: ${course.earnings}</p>
                <p>{course.description}</p>
            </div>
        ))}
    </div>
);

const MentorDashboard = () => {
    // Sample data
    const courses = [
        { id: 1, title: 'Course 1', rating: 4.5, earnings: 5000, description: 'Description of Course 1' },
        { id: 2, title: 'Course 2', rating: 4.2, earnings: 7000, description: 'Description of Course 2' },
        // Add more courses as needed
    ];

    return (
        <div className="mentor-dashboard">
            <EducatorDetails />
            <CoursesList courses={courses} />
        </div>
    );
};

export default MentorDashboard;