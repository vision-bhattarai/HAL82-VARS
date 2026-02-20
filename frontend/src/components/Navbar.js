import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    if (onLogout) await onLogout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="startease-nav">
      <Link to="/" className="startease-logo">
        Start<span>Ease</span>
      </Link>
      <ul className="startease-nav-links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Campaigns</Link></li>
        <li><Link to="/how-it-works" className={location.pathname === '/how-it-works' ? 'active' : ''}>How it Works</Link></li>
        <li>{isAuthenticated ? <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>Settings</Link> : <a href="/">Settings</a>}</li>
      </ul>

      <div className="startease-nav-actions">
        {isAuthenticated && user ? (
          <div className="startease-user-dropdown">
            <button
              className="startease-user-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="startease-user-avatar">
                {user.user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="startease-user-name">{user.user?.username || 'User'}</span>
            </button>
            {dropdownOpen && (
              <div className="startease-user-menu">
                {user?.startup_profile ? (
                  <>
                    <Link to="/create-campaign" className="startease-user-menu-item" onClick={() => setDropdownOpen(false)}>
                      Create Campaign
                    </Link>
                    <Link to="/my-dashboard" className="startease-user-menu-item" onClick={() => setDropdownOpen(false)}>
                      My Dashboard
                    </Link>
                  </>
                ) : (
                  <Link to="/become-startup" className="startease-user-menu-item" onClick={() => setDropdownOpen(false)}>
                    Become a Startup
                  </Link>
                )}

                <button onClick={handleLogout} className="startease-user-menu-item startease-logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="startease-btn startease-btn-ghost">Log in</Link>
            <Link to="/register" className="startease-btn startease-btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
