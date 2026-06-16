// frontend/src/App.js
// Root component – sets up routing and layout

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';

// Global design system
import './styles/globals.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Shared components
import Navbar from './components/shared/Navbar';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages
import Home from './pages/Home';

// Student pages
import StudentLogin from './pages/student/Login';
import Register from './pages/student/Register';
import StudentDashboard from './pages/student/Dashboard';
import Companies from './pages/student/Companies';
import Applications from './pages/student/Applications';

// Admin pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import AdminCompanies from './pages/admin/Companies';
import AdminApplications from './pages/admin/Applications';

import PlacementAnalytics from './pages/admin/PlacementAnalytics';
import ExportReports from './pages/admin/ExportReports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Student routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/companies" element={
            <ProtectedRoute requiredRole="student"><Companies /></ProtectedRoute>
          } />
          <Route path="/student/applications" element={
            <ProtectedRoute requiredRole="student"><Applications /></ProtectedRoute>
          } />

          {/* Protected Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute requiredRole="admin"><Students /></ProtectedRoute>
          } />
          <Route path="/admin/companies" element={
            <ProtectedRoute requiredRole="admin"><AdminCompanies /></ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute requiredRole="admin"><AdminApplications /></ProtectedRoute>
          } />

          <Route path="/admin/analytics" element={
            <ProtectedRoute requiredRole="admin"><PlacementAnalytics /></ProtectedRoute>
          } />
          <Route path="/admin/export" element={
            <ProtectedRoute requiredRole="admin"><ExportReports /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
