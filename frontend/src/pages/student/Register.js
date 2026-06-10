// frontend/src/pages/student/Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const BRANCHES = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical'];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', cgpa: '', branch: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 10) {
      return toast.error('CGPA must be between 0 and 10');
    }
    setLoading(true);
    try {
      await api.post('/auth/student/register', form);
      toast.success('Registration successful! Please login.');
      navigate('/student/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ background: 'linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <span style={{ fontSize: '2.5rem' }}>👤</span>
                  <h3 className="fw-bold mt-2 mb-0" style={{ color: '#1a1a2e' }}>Create Account</h3>
                  <p className="text-muted small">Join PlacementHub and start applying</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Full Name</label>
                    <input type="text" name="name" className="form-control" placeholder="Arjun Sharma"
                      value={form.name} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">College Email</label>
                    <input type="email" name="email" className="form-control" placeholder="name@college.edu"
                      value={form.email} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Min. 6 characters"
                      value={form.password} onChange={handleChange} required minLength={6} />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold small">CGPA (out of 10)</label>
                      <input type="number" name="cgpa" className="form-control" placeholder="8.50"
                        value={form.cgpa} onChange={handleChange} required min="0" max="10" step="0.01" />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold small">Branch</label>
                      <select name="branch" className="form-select" value={form.branch} onChange={handleChange} required>
                        <option value="">Select...</option>
                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn w-100 fw-semibold py-2 mt-2"
                    style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: '#fff', borderRadius: '12px' }}
                    disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating Account...</> : 'Register'}
                  </button>
                </form>

                <p className="text-center text-muted small mt-4 mb-0">
                  Already have an account? <Link to="/student/login" className="fw-semibold text-decoration-none" style={{ color: '#5378ff' }}>Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
