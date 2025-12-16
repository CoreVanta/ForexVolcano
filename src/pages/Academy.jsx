import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import SEO from '../components/SEO';

const Academy = () => {
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaths = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'courses'));
                const courses = snapshot.docs.map(doc => doc.data());

                // Group by path
                const pathMap = {};
                courses.forEach(course => {
                    const pathName = course.path || 'General';
                    if (!pathMap[pathName]) {
                        pathMap[pathName] = {
                            name: pathName,
                            count: 0,
                            image: course.image // Use first found image as cover
                        };
                    }
                    pathMap[pathName].count += 1;
                });

                setPaths(Object.values(pathMap));
            } catch (error) {
                console.error("Error fetching paths:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPaths();
    }, []);

    if (loading) return <div className="p-10 text-center text-white">Loading Academy...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <SEO title="Trading Academy" description="Master the markets with our comprehensive trading courses and learning paths." />
            <h1 className="text-4xl font-bold text-white mb-2">My Academy</h1>
            <p className="text-gray-400 mb-10">Choose a learning path to start your journey.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paths.map(path => (
                    <Link key={path.name} to={`/academy/${encodeURIComponent(path.name)}`} className="group">
                        <div className="bg-surface rounded-xl border border-gray-800 overflow-hidden hover:border-primary transition-all h-full flex flex-col">
                            <div className="h-48 bg-gray-900 relative overflow-hidden">
                                {path.image ? (
                                    <img src={path.image} alt={path.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                        <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{path.name}</h3>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <p className="text-gray-400">{path.count} Course{path.count !== 1 && 's'} available</p>
                                <span className="text-primary mt-4 inline-flex items-center text-sm font-medium">
                                    Explore Path <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {paths.length === 0 && (
                <div className="text-center py-20 bg-surface rounded-xl border border-gray-800">
                    <p className="text-gray-500">No academy paths available yet.</p>
                </div>
            )}
        </div>
    );
};

export default Academy;
