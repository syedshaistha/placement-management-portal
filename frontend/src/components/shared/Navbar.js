// frontend/src/components/shared/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_STYLES = `
  /* ── Navbar shell ── */
  .ph-nav {
    position: sticky; top: 0; z-index: 1040;
    background: rgba(17, 24, 39, 0.96);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
    transition: box-shadow 0.22s ease;
  }
  .ph-nav.scrolled {
    box-shadow: 0 4px 28px rgba(0,0,0,0.28);
  }
  .ph-nav-inner {
    display: flex; align-items: center; justify-content: space-between;
    height: 62px; padding: 0 4px;
  }

  /* ── Brand ── */
  .ph-brand {
    display: flex; align-items: center; gap: 11px;
    text-decoration: none; flex-shrink: 0;
  }
  .ph-brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #4f62d4, #0d9488);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(79,98,212,0.35);
  }
  .ph-brand-text {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800; font-size: 1.05rem;
    color: #fff; letter-spacing: -0.4px;
  }
  .ph-brand-text em {
    font-style: normal;
    background: linear-gradient(135deg, #7b93ff, #5eead4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Desktop links ── */
  .ph-nav-links {
    display: flex; align-items: center; gap: 2px;
    list-style: none; margin: 0; padding: 0;
  }
  .ph-nav-link {
    display: flex; align-items: center;
    padding: 7px 13px; border-radius: 9px;
    font-size: 0.855rem; font-weight: 500;
    color: rgba(255,255,255,0.65);
    text-decoration: none;
    transition: all 0.16s ease;
    white-space: nowrap; position: relative;
  }
  .ph-nav-link:hover {
    color: #fff; background: rgba(255,255,255,0.08);
  }
  .ph-nav-link.active {
    color: #fff;
    background: rgba(79,98,212,0.32);
    font-weight: 600;
  }
  .ph-nav-link.active::after {
    content: '';
    position: absolute; bottom: -1px; left: 50%;
    transform: translateX(-50%);
    width: 18px; height: 2px;
    background: #7b93ff;
    border-radius: 99px;
  }

  /* ── Nav separator ── */
  .ph-nav-sep {
    width: 1px; height: 22px;
    background: rgba(255,255,255,0.11);
    margin: 0 8px; flex-shrink: 0;
  }

  /* ── User pill ── */
  .ph-nav-user {
    display: flex; align-items: center; gap: 9px;
    padding: 5px 12px 5px 6px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 99px;
    cursor: default;
  }
  .ph-nav-avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.68rem; font-weight: 800; color: #fff;
    flex-shrink: 0; line-height: 1;
  }
  .ph-nav-uname {
    font-size: 0.8rem; font-weight: 700;
    color: rgba(255,255,255,0.88);
    max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ph-nav-role-chip {
    font-size: 0.63rem; font-weight: 700;
    padding: 2px 7px; border-radius: 99px;
    text-transform: uppercase; letter-spacing: 0.4px;
  }
  .ph-nav-role-chip.student { background: rgba(79,98,212,0.25); color: #a5b4ff; }
  .ph-nav-role-chip.admin   { background: rgba(13,148,136,0.25); color: #5eead4; }

  /* ── Buttons ── */
  .ph-nav-btn-ghost {
    padding: 6px 14px; border-radius: 9px;
    font-size: 0.8rem; font-weight: 600;
    color: rgba(255,255,255,0.65);
    border: 1.5px solid rgba(255,255,255,0.16);
    background: transparent; cursor: pointer;
    transition: all 0.16s ease; white-space: nowrap;
  }
  .ph-nav-btn-ghost:hover {
    color: #fff; border-color: rgba(255,255,255,0.38);
    background: rgba(255,255,255,0.07);
  }
  .ph-nav-btn-primary {
    padding: 7px 16px; border-radius: 9px;
    font-size: 0.8rem; font-weight: 700;
    color: #fff; background: #4f62d4;
    border: none; cursor: pointer;
    text-decoration: none; display: inline-flex; align-items: center;
    transition: all 0.16s ease; white-space: nowrap;
    box-shadow: 0 2px 8px rgba(79,98,212,0.30);
  }
  .ph-nav-btn-primary:hover {
    background: #3d50be; color: #fff; transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(79,98,212,0.40);
  }

  /* ── Hamburger ── */
  .ph-hamburger {
    display: none; flex-direction: column; gap: 4px;
    cursor: pointer; padding: 7px;
    border: none; background: transparent; border-radius: 8px;
    transition: background 0.16s ease;
  }
  .ph-hamburger:hover { background: rgba(255,255,255,0.08); }
  .ph-hamburger span {
    display: block; width: 22px; height: 2px;
    background: rgba(255,255,255,0.78); border-radius: 2px;
    transition: all 0.22s ease; transform-origin: center;
  }
  .ph-hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  .ph-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .ph-hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

  /* ── Mobile menu ── */
  .ph-mobile-menu {
    display: none; flex-direction: column;
    padding: 10px 16px 16px;
    border-top: 1px solid rgba(255,255,255,0.07);
    background: rgba(13,18,30,0.98);
    gap: 2px;
  }
  .ph-mobile-menu.open { display: flex; }
  .ph-mobile-link {
    display: flex; align-items: center;
    padding: 10px 14px; border-radius: 9px;
    font-size: 0.875rem; font-weight: 500;
    color: rgba(255,255,255,0.68);
    text-decoration: none; transition: all 0.16s ease;
  }
  .ph-mobile-link:hover, .ph-mobile-link.active {
    color: #fff; background: rgba(79,98,212,0.28);
  }
  .ph-mobile-div {
    height: 1px; background: rgba(255,255,255,0.07); margin: 6px 0;
  }
  .ph-mobile-user {
    display: flex; align-items: center; gap: 11px;
    padding: 12px 14px; border-radius: 11px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 8px;
  }

  /* ── Responsive breakpoint ── */
  @media (max-width: 920px) {
    .ph-nav-links { display: none !important; }
    .ph-hamburger { display: flex; }
  }
  @media (max-width: 480px) {
    .ph-brand-text { display: none; }
  }
`;

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'A';

  const studentLinks = [
    { to: '/student/dashboard',    label: 'Dashboard' },
    { to: '/student/companies',    label: 'Companies' },
    { to: '/student/applications', label: 'My Applications' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard',   label: 'Dashboard' },
    { to: '/admin/students',    label: 'Students' },
    { to: '/admin/companies',   label: 'Companies' },
    { to: '/admin/applications',label: 'Applications' },
    { to: '/admin/analytics',   label: 'Analytics' },
    { to: '/admin/export',      label: 'Export' },
  ];

  const links = role === 'student' ? studentLinks : role === 'admin' ? adminLinks : [];

  return (
    <>
      <style>{NAV_STYLES}</style>
      <nav className={`ph-nav${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="ph-nav-inner">

            {/* Brand */}
            <Link to="/" className="ph-brand" aria-label="PlacementHub home">
              <div className="ph-brand-icon" aria-hidden="true">🎓</div>
              <span className="ph-brand-text">Placement<em>Hub</em></span>
            </Link>

            {/* Desktop nav */}
            <ul className="ph-nav-links" role="list">
              {!user && (
                <>
                  <li>
                    <Link to="/student/login" className={`ph-nav-link${isActive('/student/login') ? ' active' : ''}`}>
                      Student Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/student/register" className={`ph-nav-link${isActive('/student/register') ? ' active' : ''}`}>
                      Register
                    </Link>
                  </li>
                  <li className="ph-nav-sep" role="separator" aria-hidden="true" />
                  <li>
                    <Link to="/admin/login" className="ph-nav-btn-primary">Admin Portal</Link>
                  </li>
                </>
              )}

              {user && links.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={`ph-nav-link${isActive(to) ? ' active' : ''}`}>
                    {label}
                  </Link>
                </li>
              ))}

              {user && (
                <>
                  <li className="ph-nav-sep" role="separator" aria-hidden="true" />
                  <li>
                    <div className="ph-nav-user">
                      <div
                        className="ph-nav-avatar"
                        style={{
                          background: role === 'admin'
                            ? 'linear-gradient(135deg, #0d9488, #059669)'
                            : 'linear-gradient(135deg, #4f62d4, #7c3aed)',
                        }}
                        aria-hidden="true"
                      >
                        {initials}
                      </div>
                      <span className="ph-nav-uname">
                        {role === 'admin' ? 'Admin' : user.name?.split(' ')[0]}
                      </span>
                      <span className={`ph-nav-role-chip ${role}`}>{role}</span>
                    </div>
                  </li>
                  <li>
                    <button className="ph-nav-btn-ghost" onClick={handleLogout} aria-label="Logout">
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>

            {/* Hamburger */}
            <button
              className={`ph-hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="ph-mobile-nav"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="ph-mobile-nav"
          className={`ph-mobile-menu${menuOpen ? ' open' : ''}`}
          role="menu"
          aria-label="Mobile navigation"
        >
          {user && (
            <div className="ph-mobile-user">
              <div
                className="ph-nav-avatar ph-nav-avatar-md"
                style={{
                  width: 36, height: 36, fontSize: '0.8rem',
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, color: '#fff', flexShrink: 0,
                  background: role === 'admin'
                    ? 'linear-gradient(135deg, #0d9488, #059669)'
                    : 'linear-gradient(135deg, #4f62d4, #7c3aed)',
                }}
              >
                {initials}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.875rem' }}>
                  {role === 'admin' ? 'Administrator' : user.name}
                </div>
                <span className={`ph-nav-role-chip ${role}`} style={{ fontSize: '0.65rem' }}>{role}</span>
              </div>
            </div>
          )}

          {!user && (
            <>
              <Link to="/student/login"    className={`ph-mobile-link${isActive('/student/login') ? ' active' : ''}`}>Student Login</Link>
              <Link to="/student/register" className={`ph-mobile-link${isActive('/student/register') ? ' active' : ''}`}>Register</Link>
              <div className="ph-mobile-div" />
              <Link to="/admin/login"      className="ph-mobile-link">Admin Portal</Link>
            </>
          )}

          {user && links.map(({ to, label }) => (
            <Link key={to} to={to} className={`ph-mobile-link${isActive(to) ? ' active' : ''}`} role="menuitem">
              {label}
            </Link>
          ))}

          {user && (
            <>
              <div className="ph-mobile-div" />
              <button
                className="ph-nav-btn-ghost"
                onClick={handleLogout}
                style={{ width: '100%', marginTop: 2, textAlign: 'center' }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
