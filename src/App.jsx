import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Eagerly load critical pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy load non-critical / heavy pages
const Analysis = React.lazy(() => import('./pages/Analysis'));
const AnalysisDetail = React.lazy(() => import('./pages/AnalysisDetail'));
const News = React.lazy(() => import('./pages/News'));
const NewsDetail = React.lazy(() => import('./pages/NewsDetail'));
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ManageNews = React.lazy(() => import('./pages/admin/ManageNews'));
const ManageAnalysis = React.lazy(() => import('./pages/admin/ManageAnalysis'));
const ManageCourses = React.lazy(() => import('./pages/admin/ManageCourses'));
const AdminProfile = React.lazy(() => import('./pages/admin/AdminProfile'));
const CourseView = React.lazy(() => import('./pages/dashboard/CourseView'));
const Academy = React.lazy(() => import('./pages/Academy'));
const AcademyPath = React.lazy(() => import('./pages/AcademyPath'));
const AcademyCourse = React.lazy(() => import('./pages/AcademyCourse'));
const Social = React.lazy(() => import('./pages/Social'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const MarketAll = React.lazy(() => import('./pages/MarketAll'));
const PairDetails = React.lazy(() => import('./pages/PairDetails'));
const CalendarPage = React.lazy(() => import('./pages/CalendarPage'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';


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
    <Router>
      <div className="min-h-screen bg-background text-text font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className="flex h-[50vh] items-center justify-center text-gray-500">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/analysis/:id" element={<AnalysisDetail />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Social Network */}
              <Route path="/community" element={
                <ProtectedRoute>
                  <Social />
                </ProtectedRoute>
              } />

              <Route path="/academy" element={<Academy />} />
              <Route path="/academy/:path" element={<AcademyPath />} />
              <Route path="/academy/:path/:courseId" element={<AcademyCourse />} />

              <Route path="/market" element={<MarketAll />} />
              <Route path="/market/:symbol" element={<PairDetails />} />

              <Route path="/profile/:username" element={<UserProfile />} />

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/course/:courseId" element={
                <ProtectedRoute>
                  <CourseView />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="news" element={<ManageNews />} />
                <Route path="analysis" element={<ManageAnalysis />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
