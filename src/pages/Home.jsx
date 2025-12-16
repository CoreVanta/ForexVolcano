import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import MarketWatch from '../components/market/MarketWatch';
import EconomicCalendar from '../components/market/EconomicCalendar';

const Home = () => {
    const [latestAnalysis, setLatestAnalysis] = useState([]);
    const [latestNews, setLatestNews] = useState([]);
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper to strip HTML tags
    const stripHtml = (html) => {
        if (!html) return "";
        const htmlWithSpaces = html.replace(/<\/p>/gi, ' ')
            .replace(/<\/div>/gi, ' ')
            .replace(/<br\s*\/?>/gi, ' ');
        const tmp = document.createElement("DIV");
        tmp.innerHTML = htmlWithSpaces;
        return (tmp.textContent || tmp.innerText || "").trim();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Latest Analysis
                const analysisQ = query(collection(db, 'analysis'), orderBy('createdAt', 'desc'), limit(3));
                const analysisSnap = await getDocs(analysisQ);
                setLatestAnalysis(analysisSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                // Fetch Latest News - FIXED orderBy 'timestamp'
                const newsQ = query(collection(db, 'news'), orderBy('timestamp', 'desc'), limit(5));
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
                        Predict the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Eruption</span>
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

    const SectionHeader = ({ title, link, linkText, variant = 'primary' }) => (
        <div className="flex justify-between items-end mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold text-white border-l-4 pl-4 ${variant === 'secondary' ? 'border-secondary' : 'border-primary'}`}>{title}</h2>
            <Link to={link} className={`${variant === 'secondary' ? 'text-secondary hover:text-yellow-400' : 'text-primary hover:text-green-400'} font-medium flex items-center gap-1 transition-colors text-sm md:text-base`}>
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
            <SEO
                title="Home"
                description="ForexVolcano: The ultimate platform for professional forex analysis, real-time market news, and expert trading courses. Predict the market eruption with us."
            />
            <Hero />

            {/* SECTION 1: Analysis & Market Watch */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Left: Latest Market Analysis (3 Columns wide) */}
                    <div className="lg:col-span-3">
                        <SectionHeader title="Latest Market Analysis" link="/analysis" linkText="View All" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {latestAnalysis.map(item => (
                                <Link key={item.id} to={`/analysis/${item.id}`} className="group block h-full">
                                    <div className="bg-surface rounded-xl overflow-hidden border border-gray-800 h-full hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10 flex flex-col">
                                        <div className="h-40 overflow-hidden relative">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${item.type === 'Technical' ? 'bg-blue-600/90' : 'bg-purple-600/90'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded border border-primary/20">{item.pair}</span>
                                                <span className="text-[10px] text-gray-500">
                                                    {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Today'}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">{item.title}</h3>
                                            <p className="text-gray-400 text-xs line-clamp-2 mt-auto">{stripHtml(item.content).substring(0, 80)}...</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right: Market Watch (1 Column wide) */}
                    <div className="lg:col-span-1 mt-12 lg:mt-0">
                        <div className="bg-surface rounded-xl border border-gray-800 p-1">
                            <MarketWatch />
                        </div>
                    </div>

                </div>
            </section>

            {/* SECTION 2: News & Economic Calendar (50/50 Split) */}
            <section className="py-12 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                        {/* News Column */}
                        <div>
                            <SectionHeader title="Breaking Market News" link="/news" linkText="Read All" />
                            <div className="space-y-4">
                                {latestNews.map(item => (
                                    <Link key={item.id} to={`/news/${item.id}`} className="block group">
                                        <div className="bg-surface rounded-lg p-4 border border-gray-800 hover:border-gray-600 transition-colors flex items-start gap-4">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`w-2 h-2 rounded-full ${item.impact === 'High' ? 'bg-red-500 animate-pulse' :
                                                        item.impact === 'Medium' ? 'bg-orange-500' :
                                                            'bg-green-500'
                                                        }`}></span>
                                                    <span className="text-xs text-gray-400">
                                                        {item.timestamp?.seconds ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                                                <div className="flex gap-2 mt-2">
                                                    {item.currencies?.slice(0, 3).map(curr => (
                                                        <span key={curr} className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">{curr}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Calendar Column */}
                        <div>
                            <SectionHeader title="Economic Calendar" link="/calendar" linkText="Full Calendar" variant="secondary" />
                            <div className="bg-transparent overflow-hidden h-full">
                                <EconomicCalendar compact={true} />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Academy & Community CTA (Full Width) */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-gray-800 mt-8">
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
