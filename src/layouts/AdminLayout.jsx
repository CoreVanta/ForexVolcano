import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Button from '../components/ui/Button';

const AdminLayout = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().role === 'admin') {
                        setIsAdmin(true);
                    } else {
                        navigate('/dashboard');
                    }
                } catch (error) {
                    console.error("Admin check failed", error);
                    navigate('/dashboard');
                }
            } else {
                navigate('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="text-2xl font-bold mb-2">Verifying Clearance...</div>
                    <div className="text-gray-400">Please wait.</div>
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-gray-800 flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <span className="text-xl font-bold text-white tracking-wider">
                        VOLCANO <span className="text-secondary text-base">ADMIN</span>
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem to="/admin" end>Dashboard</NavItem>
                    <NavItem to="/admin/news">Manage News</NavItem>
                    <NavItem to="/admin/analysis">Manage Analysis</NavItem>
                    <NavItem to="/admin/courses">Manage Courses</NavItem>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            A
                        </div>
                        <div className="text-sm">
                            <div className="text-white font-medium">Administrator</div>
                            <div className="text-gray-500 text-xs">Super User</div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/')}>
                        Exit to Site
                    </Button>
                </div>
            </aside>

            {/* Mobile Header (visible only on small screens) */}
            <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-surface border-b border-gray-800 flex items-center px-4 justify-between z-20">
                <span className="font-bold text-white">Admin Panel</span>
                <Button size="sm" onClick={() => navigate('/')}>Exit</Button>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8 pt-24 md:pt-8">
                <Outlet />
            </main>
        </div>
    );
};

const NavItem = ({ to, children, end = false }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
            `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`
        }
    >
        {children}
    </NavLink>
);

export default AdminLayout;
