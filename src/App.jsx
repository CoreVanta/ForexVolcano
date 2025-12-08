import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Placeholder Components
const Home = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="text-center">
      <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
        <span className="block xl:inline">Master the Markets with</span>{' '}
        <span className="block text-primary xl:inline">ForexVolcano</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Comprehensive Forex education and market analysis to help you navigate the financial volcano.
      </p>
    </div>
  </div>
);
const Analysis = () => <div className="p-8 text-center text-2xl">Market Analysis Page</div>;
const News = () => <div className="p-8 text-center text-2xl">Market News Page</div>;
const Login = () => <div className="p-8 text-center text-2xl">Login Page</div>;
const Register = () => <div className="p-8 text-center text-2xl">Register Page</div>;
const Dashboard = () => <div className="p-8 text-center text-2xl">User Dashboard</div>;
const AdminDashboard = () => <div className="p-8 text-center text-2xl">Admin API & Content Management</div>;

// Protected Route HOC
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // TODO: Add actual Admin Role check here
  if (adminOnly) {
    // Mock check: if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-background text-text">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/*" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
