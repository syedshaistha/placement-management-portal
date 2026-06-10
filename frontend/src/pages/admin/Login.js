// frontend/src/pages/admin/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/admin/login', form);
      login(res.data.admin, 'admin', res.data.token);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <span style={{ fontSize: '2.5rem' }}>🛡️</span>
                  <h3 className="fw-bold mt-2 mb-0" style={{ color: '#1a1a2e' }}>Admin Portal</h3>
                  <p className="text-muted small">Authorized personnel only</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Username</label>
                    <input type="text" name="username" className="form-control" placeholder="admin"
                      value={form.username} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Enter password"
                      value={form.password} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn w-100 fw-semibold py-2"
                    style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: '#fff', borderRadius: '12px' }}
                    disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : 'Login as Admin'}
                  </button>
                </form>

                <div className="mt-4 p-3 rounded" style={{ background: '#fff8e1', fontSize: '0.8rem' }}>
                  <strong>Demo credentials:</strong><br />
                  Username: <code>admin</code> · Password: <code>password123</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
