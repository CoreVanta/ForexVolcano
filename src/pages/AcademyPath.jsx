import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const AcademyPath = () => {
    const { path } = useParams();
    const decodedPath = decodeURIComponent(path);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Filter courses by path (client-side filtering might be needed if exact match fails or for "General")
                const q = query(collection(db, 'courses'), orderBy('order', 'asc'));
                const snapshot = await getDocs(q);

                const allCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const filtered = allCourses.filter(c => {
                    const cPath = c.path || 'General';
                    return cPath === decodedPath;
                });

                setCourses(filtered);
            } catch (error) {
                console.error("Error loading courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [decodedPath]);

    if (loading) return <div className="p-10 text-center text-white">Loading Path...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="mb-8">
                <Link to="/academy" className="text-gray-500 hover:text-white mb-4 inline-block">&larr; Back to Academy</Link>
                <h1 className="text-3xl font-bold text-white"><span className="text-primary">{decodedPath}</span> Courses</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <Link key={course.id} to={`/academy/${encodeURIComponent(decodedPath)}/${course.id}`} className="group">
                        <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-all h-full">
                            <div className="h-48 bg-gray-900 relative">
                                {course.image && <img src={course.image} alt={course.title} className="w-full h-full object-cover" />}
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs text-white border border-gray-700">
                                    {course.level}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                                <span className="text-sm font-medium text-white group-hover:underline">Start Learning &rarr;</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="text-center py-20 bg-surface rounded-xl border border-gray-800">
                    <p className="text-gray-500">No courses found in this path.</p>
                </div>
            )}
        </div>
    );
};

export default AcademyPath;
