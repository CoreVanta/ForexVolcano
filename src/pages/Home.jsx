import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Button from '../components/ui/Button';

const Home = () => {
    const [latestAnalysis, setLatestAnalysis] = useState([]);
    const [latestNews, setLatestNews] = useState([]);
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Latest Analysis
                const analysisQ = query(collection(db, 'analysis'), orderBy('createdAt', 'desc'), limit(3));
                const analysisSnap = await getDocs(analysisQ);
                setLatestAnalysis(analysisSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch Latest News
                const newsQ = query(collection(db, 'news'), orderBy('date', 'desc'), limit(3));
                const newsSnap = await getDocs(newsQ);
                setLatestNews(newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch Featured Courses
                const coursesQ = query(collection(db, 'courses'), limit(3)); // Ideally order by popularity or created
                const coursesSnap = await getDocs(coursesQ);
                setFeaturedCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const Hero = () => (
        <div className="relative bg-background overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2070&auto=format&fit=crop"
                    alt="Trading Chart"
                    className="w-full h-full object-cover opacity-20"
                />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="max-w-3xl animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
                        Master the Markets with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">ForexVolcano</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
                        Your all-in-one platform for professional market analysis, breaking news, and comprehensive trading education. Join thousands of traders leveling up their game.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/register">
                            <Button size="lg" className="px-8 text-lg">Start Trading Now</Button>
                        </Link>
                        <Link to="/analysis">
                            <Button variant="outline" size="lg" className="px-8 text-lg">Read Analysis</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    const SectionHeader = ({ title, link, linkText }) => (
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-white border-l-4 border-primary pl-4">{title}</h2>
            <Link to={link} className="text-primary hover:text-green-400 font-medium flex items-center gap-1 transition-colors">
                {linkText}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>
        </div>
    );

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading Market Data...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Hero />

            {/* Latest Analysis */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <SectionHeader title="Latest Market Analysis" link="/analysis" linkText="View All Analysis" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {latestAnalysis.map(item => (
                        <Link key={item.id} to={`/analysis/${item.id}`} className="group block h-full">
                            <div className="bg-surface rounded-xl overflow-hidden border border-gray-800 h-full hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${item.type === 'Technical' ? 'bg-blue-600' : 'bg-purple-600'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded">{item.pair}</span>
                                        <span className="text-xs text-gray-500">
                                            {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-3">{item.content?.substring(0, 100)}...</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Breaking News */}
            <section className="py-16 bg-surface/50 w-full border-y border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader title="Breaking Market News" link="/news" linkText="Read All News" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {latestNews.map(item => (
                            <Link key={item.id} to={`/news/${item.id}`} className="block group">
                                <div className="bg-background rounded-xl p-6 border border-gray-800 hover:border-gray-600 transition-colors h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.impact === 'High' ? 'bg-red-500/20 text-red-500' :
                                                item.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    'bg-green-500/20 text-green-500'
                                            }`}>
                                            {item.impact} Impact
                                        </span>
                                        <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                    <div className="flex gap-2 mt-auto pt-4">
                                        {item.currencies?.map(curr => (
                                            <span key={curr} className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{curr}</span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Academy & Community CTA */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">Level Up Your Trading Skills</h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Join our comprehensive academy with courses designed for every level. From interpreting candlestick patterns to mastering complex strategies.
                        </p>
                        <div className="space-y-4 mb-8">
                            {featuredCourses.slice(0, 2).map(course => (
                                <div key={course.id} className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-gray-800">
                                    <div className="h-16 w-24 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{course.title}</h4>
                                        <p className="text-sm text-gray-500">{course.lessons?.length || 0} Lessons • {course.level || 'All Levels'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to="/academy">
                            <Button variant="secondary">Start Learning Free</Button>
                        </Link>
                    </div>

                    <div className="relative h-full min-h-[400px] bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-8 flex flex-col justify-center items-center text-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-white mb-4">Join the Community</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                Connect with other traders, share your charts, and get real-time feedback. The journey is better together.
                            </p>
                            <Link to="/community">
                                <Button size="lg" className="w-full sm:w-auto px-10 shadow-lg shadow-primary/25 animate-pulse">
                                    Join Discussion
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
