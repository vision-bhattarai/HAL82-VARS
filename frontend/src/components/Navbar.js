import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isAuthenticated, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <strong>Start</strong><span>Ease</span>
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Campaigns</Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle">
                  {user?.user?.username || 'User'}
                </span>
                <div className="dropdown-menu">
                  {user?.startup_profile ? (
                    <>
                      <Link to="/create-campaign" className="dropdown-item">Create Campaign</Link>
                      <Link to="/dashboard" className="dropdown-item">My Campaigns</Link>
                    </>
                  ) : (
                    <Link to="/become-startup" className="dropdown-item">Become a Startup</Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    Logout
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link nav-link-btn button-primary">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
