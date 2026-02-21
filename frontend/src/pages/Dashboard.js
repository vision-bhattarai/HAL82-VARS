import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../services/api';
import './Dashboard.css';

function Dashboard({ user }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const isStartup = Boolean(user?.startup_profile || user?.startup || user?.is_startup);

  useEffect(() => {
    fetchCampaigns();
  }, [filter]);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (filter === 'trending') {
        response = await campaignService.getTrendingCampaigns();
      } else if (filter === 'popular') {
        response = await campaignService.getPopularCampaigns();
      } else {
        response = await campaignService.getAllCampaigns({ status: 'active' });
      }
      setCampaigns(response.data.results || response.data);
    } catch (err) {
      setError('Failed to load campaigns. Please try again later.');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard page-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>Discover Campaigns</h1>
          <p>Support innovative startups and get early access to amazing products</p>
        </div>

        {isStartup && (
          <div className="startup-banner">
            <h3>Welcome back, {user?.startup_profile?.company_name || user?.startup?.company_name || 'Startup'}!</h3>
            <Link to="/create-campaign" className="button-primary">+ Create New Campaign</Link>
          </div>
        )}

        <div className="filter-section">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Campaigns
          </button>
          <button
            className={`filter-btn ${filter === 'trending' ? 'active' : ''}`}
            onClick={() => setFilter('trending')}
          >
            Trending
          </button>
          <button
            className={`filter-btn ${filter === 'popular' ? 'active' : ''}`}
            onClick={() => setFilter('popular')}
          >
            Most Funded
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-message">Loading campaigns...</div>
        ) : campaigns && campaigns.length > 0 ? (
          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="no-campaigns">
            <p>No campaigns found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignCard({ campaign }) {
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
        
        <div className="campaign-type-badge">
          {campaign.product_type === 'physical' ? '📦' : campaign.product_type === 'digital' ? '💻' : '🎯'}
          {' '}
          {campaign.product_type.charAt(0).toUpperCase() + campaign.product_type.slice(1)}
        </div>

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

export default Dashboard;
