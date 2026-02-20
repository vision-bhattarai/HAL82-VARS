import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './StartEaseLanding.css';

function StartEaseLanding() {
  const statsRef = useRef(null);

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
          <li><a href="#featured">Startups</a></li>
          <li><a href="#featured">How it Works</a></li>
          <li><a href="/">Setting</a></li>
        </ul>
        <div className="startease-nav-actions">
          <Link to="/login" className="startease-btn startease-btn-ghost">
            Log in
          </Link>
          <Link to="/register" className="startease-btn startease-btn-primary">
            Get Started
          </Link>
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
            Explore Startups
          </Link>
          <a href="#featured" className="startease-btn startease-btn-ghost">
            How it Works
          </a>
        </div>
      </section>

      {/* STATS */}
      <div className="startease-stats" ref={statsRef}>
        <div className="startease-stat-item">
          <div className="startease-stat-icon">Milestone</div>
          <div className="startease-stat-num">0</div>
          <div className="startease-stat-label">Startups Helped</div>
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
        <div className="startease-section-label">Featured Startups</div>
        <div className="startease-startup-grid">
          {/* Card 1 */}
          <div className="startease-startup-card">
            <span className="startease-card-tag">Energy</span>
            <div className="startease-card-title">Solar Key</div>
            <div className="startease-card-desc">
              Charge your device anywhere you like, powered entirely by renewable solar energy.
            </div>
            <div className="startease-progress-wrap">
              <div className="startease-progress-header">
                <span className="startease-progress-label">Funding Progress</span>
                <span className="startease-progress-pct">60%</span>
              </div>
              <div className="startease-progress-bar">
                <div
                  className="startease-progress-fill"
                  style={{ width: '60%' }}
                />
              </div>
            </div>
            <div className="startease-card-footer">
              <button className="startease-btn-details">Details →</button>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                $360K of $600K
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="startease-startup-card">
            <span className="startease-card-tag">Consumer</span>
            <div className="startease-card-title">Safal's Lamp</div>
            <div className="startease-card-desc">
              Charge your device anywhere you like with elegant design meets sustainable function.
            </div>
            <div className="startease-progress-wrap">
              <div className="startease-progress-header">
                <span className="startease-progress-label">Funding Progress</span>
                <span className="startease-progress-pct">30%</span>
              </div>
              <div className="startease-progress-bar">
                <div
                  className="startease-progress-fill"
                  style={{ width: '30%' }}
                />
              </div>
            </div>
            <div className="startease-card-footer">
              <button className="startease-btn-details">Details →</button>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                $90K of $300K
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="startease-startup-card">
            <span className="startease-card-tag">Media</span>
            <div className="startease-card-title">PageTurn</div>
            <div className="startease-card-desc">
              A digital comic book marketplace connecting independent creators with global readers.
            </div>
            <div className="startease-progress-wrap">
              <div className="startease-progress-header">
                <span className="startease-progress-label">Funding Progress</span>
                <span className="startease-progress-pct">78%</span>
              </div>
              <div className="startease-progress-bar">
                <div
                  className="startease-progress-fill"
                  style={{ width: '78%' }}
                />
              </div>
            </div>
            <div className="startease-card-footer">
              <button className="startease-btn-details">Details →</button>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                $390K of $500K
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="startease-stories startease-section">
        <div className="startease-section-label">Success Stories</div>
        <div className="startease-stories-grid">
          {/* Story 1 */}
          <div className="startease-story-card">
            <div
              className="startease-story-img-placeholder"
              style={{
                background: 'linear-gradient(135deg, #b8a898 0%, #8a7d6e 100%)',
              }}
            />
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
            <div
              className="startease-story-img-placeholder"
              style={{
                background: 'linear-gradient(135deg, #9aaa94 0%, #6d7f68 100%)',
              }}
            />
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
            <div
              className="startease-story-img-placeholder"
              style={{
                background: 'linear-gradient(135deg, #a89c88 0%, #7a6f5e 100%)',
              }}
            />
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
                <a href="/">How it Works</a>
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
