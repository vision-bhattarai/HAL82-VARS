import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { campaignService } from '../services/api';
import './StartEaseLanding.css';

function StartEaseLanding({ isAuthenticated, user, onLogout }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
    setDropdownOpen(false);
    navigate('/');
  };
  const statsRef = useRef(null);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setCampaignsLoading(true);
      try {
        const res = await campaignService.getAllCampaigns({ status: 'active' });
        const data = res.data.results || res.data;
        setCampaigns((data || []).slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured campaigns:', err);
        setCampaigns([]);
      } finally {
        setCampaignsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          el.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(
      '.startease-startup-card, .startease-story-card, .startease-stat-item'
    ).forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Counter animation for stats
    const animateCounter = (el, target, suffix = '') => {
      let start = 0;
      const duration = 1800;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nums = entry.target.querySelectorAll('.startease-stat-num');
          if (nums[0]) animateCounter(nums[0], 300, '+');
          if (nums[1]) animateCounter(nums[1], 60000000, '+');
          if (nums[2]) animateCounter(nums[2], 500000, '+');
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => {
      statsObserver.disconnect();
    };
  }, []);

  return (
    <div className="startease-landing">
      {/* NAV */}
      <nav className="startease-nav">
        <Link to="/" className="startease-logo">
          Start<span>Ease</span>
        </Link>
        <ul className="startease-nav-links">
          <li><a href="/" className="active">Home</a></li>
          <li><Link to="/dashboard">Campaigns</Link></li>
          <li><Link to="/how-it-works">How it Works</Link></li>
          <li>{isAuthenticated ? <Link to="/settings">Settings</Link> : <a href="/">Settings</a>}</li>
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
                  <Link to="/my-dashboard" className="startease-user-menu-item" onClick={() => setDropdownOpen(false)}>
                    My Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="startease-user-menu-item startease-logout-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="startease-btn startease-btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="startease-btn startease-btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* HERO */}
      <section className="startease-hero">
        <p className="startease-hero-tag">The startup accelerator platform</p>
        <h1>Enhance your <em>startup.</em></h1>
        <p className="startease-hero-sub">
          Connect with investors, track your growth, and build the future — all in one place.
        </p>
        <div className="startease-hero-cta">
          <Link to="/dashboard" className="startease-btn startease-btn-primary">
            Explore Campaigns
          </Link>
          <Link to="/how-it-works" className="startease-btn startease-btn-ghost">
            How it Works
          </Link>
        </div>
      </section>

      {/* STATS */}
      <div className="startease-stats" ref={statsRef}>
        <div className="startease-stat-item">
          <div className="startease-stat-icon">Milestone</div>
          <div className="startease-stat-num">0</div>
          <div className="startease-stat-label">Campaigns Helped</div>
        </div>
        <div className="startease-stat-item">
          <div className="startease-stat-icon">$ Capital</div>
          <div className="startease-stat-num">0</div>
          <div className="startease-stat-label">Raised</div>
        </div>
        <div className="startease-stat-item">
          <div className="startease-stat-icon">Deliveries</div>
          <div className="startease-stat-num">0</div>
          <div className="startease-stat-label">Products Delivered</div>
        </div>
      </div>

      {/* FEATURED STARTUPS */}
      <section className="startease-featured startease-section" id="featured">
        <div className="startease-section-label">Featured Campaigns</div>
        {campaignsLoading ? (
          <div className="startease-campaign-grid">Loading...</div>
        ) : (
          <div className="startease-campaign-grid">
            {campaigns.map((c, idx) => (
              <Link to={`/campaign/${c.id}`} key={c.id} className="startease-campaign-card">
                <span className="startease-card-tag">{c.product_type}</span>
                <div className="startease-card-title">{c.product_name}</div>
                <div className="startease-card-desc">{c.description.substring(0, 120)}</div>
                <div className="startease-progress-wrap">
                  <div className="startease-progress-header">
                    <span className="startease-progress-label">Funding Progress</span>
                    <span className="startease-progress-pct">{c.progress_percentage?.toFixed(0) || 0}%</span>
                  </div>
                  <div className="startease-progress-bar">
                    <div
                      className="startease-progress-fill"
                      style={{ width: `${Math.min(c.progress_percentage || 0, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="startease-card-footer">
                  <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                    ${Number(c.current_amount).toLocaleString()} of ${Number(c.goal_amount).toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Explore Button */}
        <div className="startease-explore-cta">
          <Link to="/dashboard" className="startease-btn startease-btn-primary startease-btn-explore">
            Explore All Campaigns
          </Link>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="startease-stories startease-section">
        <div className="startease-section-label">Success Stories</div>
        <div className="startease-stories-grid">
          {/* Story 1 */}
          <div className="startease-story-card">
            <img className="startease-story-image" src="/success-stories/doctor-success.jpg" alt="Safal success story" />
            <div className="startease-story-overlay">
              <span style={{ color: '#fff', fontSize: '0.8rem', fontFamily: "'DM Mono',monospace" }}>
                Read Story →
              </span>
            </div>
            <div className="startease-story-body">
              <div className="startease-story-meta">Safal · Comic Books</div>
              <div className="startease-story-title">
                How Safal funded his startup of a comic book business.
              </div>
            </div>
          </div>

          {/* Story 2 */}
          <div className="startease-story-card">
            <img className="startease-story-image" src="/success-stories/story-2.jpg" alt="Riya success story" />
            <div className="startease-story-overlay">
              <span style={{ color: '#fff', fontSize: '0.8rem', fontFamily: "'DM Mono',monospace" }}>
                Read Story →
              </span>
            </div>
            <div className="startease-story-body">
              <div className="startease-story-meta">Riya · Renewable Tech</div>
              <div className="startease-story-title">
                From garage prototype to $2M in funding in under a year.
              </div>
            </div>
          </div>

          {/* Story 3 */}
          <div className="startease-story-card">
            <img className="startease-story-image" src="/success-stories/story-3.jpg" alt="Arjun success story" />
            <div className="startease-story-overlay">
              <span style={{ color: '#fff', fontSize: '0.8rem', fontFamily: "'DM Mono',monospace" }}>
                Read Story →
              </span>
            </div>
            <div className="startease-story-body">
              <div className="startease-story-meta">Arjun · EdTech</div>
              <div className="startease-story-title">
                Building a learning platform that reached 50K students.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="startease-quote-section">
        <p className="startease-quote-text">"Giving up is never an option."</p>
      </section>

      {/* FOOTER */}
      <footer className="startease-footer">
        <div className="startease-footer-top">
          <div className="startease-footer-brand">
            <Link to="/" className="startease-logo">
              Start<span style={{ color: 'var(--accent)' }}>Ease</span>
            </Link>
            <p>
              Empowering founders with the tools, capital, and community they need to build
              extraordinary companies.
            </p>
          </div>
          <div className="startease-footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="/">About Us</a>
              </li>
              <li>
                <a href="/">Careers</a>
              </li>
              <li>
                <a href="/">Press</a>
              </li>
              <li>
                <a href="/">Blog</a>
              </li>
            </ul>
          </div>
          <div className="startease-footer-col">
            <h4>Platform</h4>
            <ul>
              <li>
                <a href="/">Startups</a>
              </li>
              <li>
                <a href="/">Investors</a>
              </li>
              <li>
                <Link to="/how-it-works">How it Works</Link>
              </li>
              <li>
                <a href="/">Pricing</a>
              </li>
            </ul>
          </div>
          <div className="startease-footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="/">Contact</a>
              </li>
              <li>
                <a href="/">License</a>
              </li>
              <li>
                <a href="/">Privacy</a>
              </li>
              <li>
                <a href="/">Terms</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="startease-footer-bottom">
          <p>© 2025 StartEase. All rights reserved.</p>
          <p>Built for founders, by founders.</p>
        </div>
      </footer>
    </div>
  );
}

export default StartEaseLanding;
