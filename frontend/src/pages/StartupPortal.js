import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignService } from '../services/api';
import './StartupPortal.css';

function StartupPortal({ user }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await campaignService.getMyCampaigns();
        setCampaigns(response.data || []);
      } catch (err) {
        setError('Failed to load your campaigns.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCampaigns();
  }, []);

  return (
    <div className="startup-portal page-container">
      <div className="container">
        <div className="startup-portal-header">
          <h1>Startup Portal</h1>
          <p>
            Welcome back{user?.startup_profile?.company_name ? `, ${user.startup_profile.company_name}` : ''}. 
            Create campaigns and raise funds from normal user accounts.
          </p>
        </div>

        <div className="startup-portal-actions">
          <Link to="/create-campaign" className="button-primary">
            + Upload New Campaign
          </Link>
          <Link to="/dashboard" className="button-secondary">
            View Public Campaign Feed
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="startup-campaigns-section">
          <h2>My Campaigns</h2>

          {loading ? (
            <div className="loading-message">Loading your campaigns...</div>
          ) : campaigns.length > 0 ? (
            <div className="startup-campaign-grid">
              {campaigns.map((campaign) => (
                <Link to={`/campaign/${campaign.id}`} key={campaign.id} className="startup-campaign-card">
                  <div className="startup-campaign-title">{campaign.product_name}</div>
                  <div className="startup-campaign-meta">{campaign.product_type}</div>
                  <div className="startup-campaign-funding">
                    <span>${Number(campaign.current_amount || 0).toLocaleString()}</span>
                    <span>of ${Number(campaign.goal_amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="startup-campaign-status">
                    <span className={`status-badge ${campaign.status}`}>{campaign.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-campaigns">
              <p>You haven't uploaded any campaign yet.</p>
              <Link to="/create-campaign" className="button-primary">Create your first campaign</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartupPortal;
