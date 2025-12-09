import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getCountFromServer } from 'firebase/firestore';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        courses: 0,
        analysis: 0,
        news: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersSnap = await getCountFromServer(collection(db, "users"));
                const coursesSnap = await getCountFromServer(collection(db, "courses"));
                const analysisSnap = await getCountFromServer(collection(db, "analysis"));
                const newsSnap = await getCountFromServer(collection(db, "news"));

                setStats({
                    users: usersSnap.data().count,
                    courses: coursesSnap.data().count,
                    analysis: analysisSnap.data().count,
                    news: newsSnap.data().count
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">System Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard title="Total Users" value={loading ? "..." : stats.users} change="Registered" color="primary" />
                <StatCard title="Active Courses" value={loading ? "..." : stats.courses} change="Live" color="white" />
                <StatCard title="Analysis Posts" value={loading ? "..." : stats.analysis} change="Market Updates" color="secondary" />
                <StatCard title="News Alerts" value={loading ? "..." : stats.news} change="Published" color="accent" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions Placeholder */}
                <div className="bg-surface rounded-xl border border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <ActionRow label="Post New Analysis" to="/admin/analysis" />
                        <ActionRow label="Broadcast News Alert" to="/admin/news" />
                        <ActionRow label="Review New User Signups" to="#" />
                    </div>
                </div>

                {/* System Health / Recent Logs */}
                <div className="bg-surface rounded-xl border border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
                    <div className="space-y-4">
                        <StatusRow label="Database Connection" status="Healthy" />
                        <StatusRow label="Auth Service" status="Healthy" />
                        <StatusRow label="API Latency" status="24ms" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, change, color }) => {
    const colors = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        white: 'text-white'
    };

    return (
        <div className="bg-surface rounded-xl p-6 border border-gray-800">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <div className="mt-2 flex items-baseline">
                <p className={`text-3xl font-semibold ${colors[color] || 'text-white'}`}>
                    {value}
                </p>
                <p className="ml-2 text-sm text-gray-500">{change}</p>
            </div>
        </div>
    );
};

const ActionRow = ({ label, to }) => (
    <Link to={to} className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-gray-800 cursor-pointer transition-colors">
        <span className="text-gray-300">{label}</span>
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    </Link>
);

const StatusRow = ({ label, status }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-400">{label}</span>
        <span className="flex items-center text-primary text-sm font-medium">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            {status}
        </span>
    </div>
);

export default AdminDashboard;
