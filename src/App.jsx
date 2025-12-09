import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import News from './pages/News';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Placeholder Components
const Login = () => <div className="p-8 text-center text-2xl pt-24">Login Page</div>;
const Register = () => <div className="p-8 text-center text-2xl pt-24">Register Page</div>;
const Dashboard = () => <div className="p-8 text-center text-2xl pt-24">User Dashboard</div>;
const AdminDashboard = () => <div className="p-8 text-center text-2xl pt-24">Admin API & Content Management</div>;

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

  if (loading) return <div className="text-center p-10 pt-32 text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly) {
    // Mock check: if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-background text-text font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow">
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
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
