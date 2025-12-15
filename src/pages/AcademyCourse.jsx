// Adapted from CourseView.jsx for public access
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import Button from '../components/ui/Button';

const AcademyCourse = () => {
    const { path, courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                // 1. Fetch Course Details
                const courseDoc = await getDoc(doc(db, 'courses', courseId));
                if (!courseDoc.exists()) {
                    alert("Course not found");
                    navigate(`/academy/${path}`); // Navigate back to path
                    return;
                }
                setCourse({ id: courseDoc.id, ...courseDoc.data() });

                // 2. Fetch Lessons
                const q = query(collection(db, 'courses', courseId, 'lessons'), orderBy('order', 'asc'));
                const lessonSnap = await getDocs(q);

                let lessonData = [];
                if (!lessonSnap.empty) {
                    lessonData = lessonSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                } else {
                    const fallbackSnap = await getDocs(collection(db, 'courses', courseId, 'lessons'));
                    lessonData = fallbackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                }

                setLessons(lessonData);
                if (lessonData.length > 0) {
                    setActiveLesson(lessonData[0]);
                }

            } catch (error) {
                console.error("Error loading course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId, navigate, path]);

    if (loading) return <div className="p-10 text-center text-white">Loading class...</div>;
    if (!course) return null;

    return (
        <div className="flex bg-background overflow-hidden animate-fade-in" style={{ height: 'calc(100vh - 64px)' }}>
            {/* Sidebar: Lesson List */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-surface border-r border-gray-800 transition-all duration-300 flex flex-col flex-shrink-0 relative`}>
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                    <h2 className="font-bold text-white truncate max-w-[200px]">{course.title}</h2>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {lessons.map((lesson, idx) => (
                        <div
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`p-4 border-b border-gray-800 cursor-pointer transition-colors hover:bg-gray-800/50 flex items-start gap-3
                   ${activeLesson?.id === lesson.id ? 'bg-primary/10 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}
                 `}
                        >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-800 text-gray-400 text-xs flex items-center justify-center mt-0.5">
                                {idx + 1}
                            </span>
                            <div>
                                <h4 className={`text-sm font-medium ${activeLesson?.id === lesson.id ? 'text-primary' : 'text-gray-300'}`}>
                                    {lesson.title}
                                </h4>
                                <span className="text-xs text-gray-500">{lesson.duration || '10 min'}</span>
                            </div>
                        </div>
                    ))}
                    {lessons.length === 0 && (
                        <div className="p-6 text-center text-gray-500 text-sm">No lessons available yet.</div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-800">
                    <Link to={`/academy/${path}`}>
                        <Button variant="outline" size="sm" className="w-full">&larr; Back to Path</Button>
                    </Link>
                </div>
            </div>

            {/* Main Content: Player */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Toggle Sidebar Button (when closed or mobile) */}
                <div className="absolute top-4 left-4 z-10">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="bg-surface/80 p-2 rounded-full text-white hover:bg-surface backdrop-blur border border-gray-700 shadow-lg"
                    >
                        {sidebarOpen ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>
                </div>

                {activeLesson ? (
                    <div className="flex-1 overflow-y-auto">
                        <div className="bg-black aspect-video w-full max-h-[60vh] flex items-center justify-center">
                            {activeLesson.videoUrl ? (
                                <iframe
                                    src={activeLesson.videoUrl}
                                    title={activeLesson.title}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="text-gray-500 text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <p>No video content.</p>
                                </div>
                            )}
                        </div>

                        <div className="max-w-4xl mx-auto p-8 pb-20">
                            <div className="flex justify-between items-start mb-6">
                                <h1 className="text-2xl font-bold text-white">{activeLesson.title}</h1>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
                            </div>

                            {(course.instructorName || course.instructorBio) && (
                                <div className="mt-12 border-t border-gray-800 pt-8">
                                    <h3 className="text-xl font-bold text-white mb-6">Meet Your Instructor</h3>
                                    <div className="flex items-start gap-6 bg-surface p-6 rounded-xl border border-gray-800">
                                        {course.instructorImage ? (
                                            <img
                                                src={course.instructorImage}
                                                alt={course.instructorName}
                                                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-400">
                                                {course.instructorName ? course.instructorName.charAt(0) : 'I'}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{course.instructorName}</h4>
                                            <p className="text-gray-400 text-sm whitespace-pre-wrap mt-2">{course.instructorBio}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Select a lesson from the list to start learning.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademyCourse;
