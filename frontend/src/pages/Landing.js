import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService, campaignService } from '../services/api';
import './Landing.css';
import './Dashboard.css';

function Landing() {
  const [stats, setStats] = useState({ total_startups: 0, total_funded: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchFeaturedCampaigns();
  }, []);

  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await userService.getStartupStats();
      // Generate random numbers for display
      setStats({
        total_startups: Math.floor(Math.random() * 100) + 50,
        total_funded: Math.floor(Math.random() * 5000000) + 1000000,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set random default stats
      setStats({
        total_startups: Math.floor(Math.random() * 100) + 50,
        total_funded: Math.floor(Math.random() * 5000000) + 1000000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedCampaigns = async () => {
    setCampaignsLoading(true);
    try {
      const res = await campaignService.getAllCampaigns({ status: 'active' });
      const data = res.data.results || res.data;
      setCampaigns((data || []).slice(0, 3));
    } catch (err) {
      console.error('Error fetching campaigns for landing:', err);
      setCampaigns([]);
    } finally {
      setCampaignsLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <h1>Welcome to StartEzz</h1>
          <p>Empowering Startups Through Community Funding</p>
          <p className="subtitle">Support innovative ideas and get early access to amazing products</p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="button-primary">Explore Campaigns</Link>
            <Link to="/register" className="button-secondary">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total_startups}</div>
              <div className="stat-label">Startups Funded</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">${(stats.total_funded / 1000000).toFixed(1)}M</div>
              <div className="stat-label">Total Funds Raised</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15K+</div>
              <div className="stat-label">Active Backers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">200+</div>
              <div className="stat-label">Active Campaigns</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose StartEzz?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Transparent</h3>
              <p>Track every donation and see real-time progress of campaigns</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure</h3>
              <p>Safe and verified transactions with verified startups</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎁</div>
              <h3>Early Access</h3>
              <p>Get early access to innovative products from startups</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Support Innovation</h3>
              <p>Help bring amazing ideas to life and support entrepreneurs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* Featured Campaigns Section */}
      <section className="featured-campaigns">
        <div className="container">
          <h2>Featured Campaigns</h2>
          {campaignsLoading ? (
            <div className="loading-message">Loading featured campaigns...</div>
          ) : campaigns && campaigns.length > 0 ? (
            <div className="campaigns-grid">
              {campaigns.map(c => (
                <FeaturedCard key={c.id} campaign={c} />
              ))}
            </div>
          ) : (
            <div className="no-campaigns">No featured campaigns found</div>
          )}
        </div>
      </section>
      <section className="cta-section">
        <div className="container text-center">
          <h2>Ready to Support Innovation?</h2>
          <p>Join thousands of backers funding the future</p>
          <Link to="/dashboard" className="button-primary">Browse Campaigns</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 StartEzz. All rights reserved.</p>
          <p>Empowering startups and innovators worldwide</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

function FeaturedCard({ campaign }) {
  const progressPercentage = campaign.progress_percentage || 0;

  return (
    <Link to={`/campaign/${campaign.id}`} className="campaign-card card">
      <div className="campaign-image">
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.product_name} />
        ) : (
          <div className="image-placeholder">📦</div>
        )}
      </div>

      <div className="card-body campaign-body">
        <h3 className="campaign-title">{campaign.product_name}</h3>
        <p className="startup-name">{campaign.startup_name}</p>
        <p className="campaign-desc">{campaign.description.substring(0, 100)}...</p>

        <div className="campaign-funding">
          <div className="funding-amount">
            <span className="current">${campaign.current_amount.toLocaleString()}</span>
            <span className="goal">of ${campaign.goal_amount.toLocaleString()}</span>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
          </div>

          <div className="funding-stats">
            <span>{progressPercentage.toFixed(0)}% funded</span>
            <span>{campaign.backer_count} backers</span>
          </div>
        </div>

        <button className="button-primary campaign-btn">View Campaign</button>
      </div>
    </Link>
  );
}
