// frontend/src/components/shared/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span style={{ fontSize: '1.5rem' }}>🎓</span>
          <span className="fw-bold" style={{ letterSpacing: '0.5px' }}>PlacementHub</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">

            {/* Not logged in */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/login">Student Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-light btn-sm px-3" to="/admin/login">Admin</Link>
                </li>
              </>
            )}

            {/* Student logged in */}
            {user && role === 'student' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/companies">Companies</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/applications">My Applications</Link>
                </li>
                <li className="nav-item ms-2">
                  <span className="badge bg-info text-dark me-2">{user.name}</span>
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}

            {/* Admin logged in */}
            {user && role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/students">Students</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/companies">Companies</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/applications">Applications</Link>
                </li>
                <li className="nav-item ms-2">
                  <span className="badge bg-warning text-dark me-2">Admin</span>
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
