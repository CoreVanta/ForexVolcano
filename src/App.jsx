import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import AnalysisDetail from './pages/AnalysisDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageNews from './pages/admin/ManageNews';
import ManageAnalysis from './pages/admin/ManageAnalysis';
import ManageCourses from './pages/admin/ManageCourses';
import AdminProfile from './pages/admin/AdminProfile';
import CourseView from './pages/dashboard/CourseView';
import Academy from './pages/Academy';
import AcademyPath from './pages/AcademyPath';
import AcademyCourse from './pages/AcademyCourse';
import Social from './pages/Social';
import UserProfile from './pages/UserProfile';
import MarketAll from './pages/MarketAll';
import PairDetails from './pages/PairDetails';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// ... (in Routes)

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

{/* Admin Routes */ }
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="news" element={<ManageNews />} />
  <Route path="analysis" element={<ManageAnalysis />} />
  <Route path="courses" element={<ManageCourses />} />
  <Route path="profile" element={<AdminProfile />} />
</Route>
          </Routes >
        </main >
  <Footer />
      </div >
    </Router >
  );
}

export default App;
