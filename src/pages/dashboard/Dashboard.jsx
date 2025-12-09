import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Button from '../../components/ui/Button';

// Mock Data incase DB is empty
const MOCK_COURSES = [
    {
        id: 'c1',
        title: 'Forex Foundations: The Bedrock',
        progress: 100,
        totalLessons: 12,
        completedLessons: 12,
        image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'c2',
        title: 'Price Action Mastery',
        progress: 45,
        totalLessons: 20,
        completedLessons: 9,
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 'c3',
        title: 'Institutional Order Flow',
        progress: 0,
        totalLessons: 15,
        completedLessons: 0,
        image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1000&auto=format&fit=crop'
    }
];

const Dashboard = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                try {
                    const docRef = doc(db, 'users', auth.currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, []);

    const displayName = userProfile?.username || auth.currentUser?.displayName || 'Trader';

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Top Welcome Section */}
            <div className="bg-surface border-b border-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary p-[2px]">
                            <img
                                src={userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${displayName}`}
                                alt="Profile"
                                className="h-full w-full rounded-full bg-background object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Welcome back, <span className="text-primary">{displayName}</span>
                            </h1>
                            <p className="mt-1 text-gray-400">
                                Ready to dominate the markets today?
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-12">
                    {/* Stat 1 */}
                    <div className="bg-surface overflow-hidden shadow rounded-lg border border-gray-800">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-400 truncate">Total Progress</dt>
                            <dd className="mt-1 text-3xl font-semibold text-white">48%</dd>
                        </div>
                    </div>
                    {/* Stat 2 */}
                    <div className="bg-surface overflow-hidden shadow rounded-lg border border-gray-800">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-400 truncate">Courses Completed</dt>
                            <dd className="mt-1 text-3xl font-semibold text-primary">1</dd>
                        </div>
                    </div>
                    {/* Stat 3 */}
                    <div className="bg-surface overflow-hidden shadow rounded-lg border border-gray-800">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-400 truncate">Quiz Score Avg</dt>
                            <dd className="mt-1 text-3xl font-semibold text-secondary">92%</dd>
                        </div>
                    </div>
                </div>

                {/* Course List */}
                <h2 className="text-2xl font-bold text-white mb-6">Your Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_COURSES.map((course) => (
                        <div key={course.id} className="bg-surface rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="primary" size="sm">Continue Learning</Button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                                        <span>Progress</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${course.progress === 100 ? 'bg-primary' : 'bg-secondary'}`}
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                                    <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
                                    {course.progress === 100 && (
                                        <span className="text-primary flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                            Completed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
