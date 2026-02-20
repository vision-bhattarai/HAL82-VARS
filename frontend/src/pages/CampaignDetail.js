import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignService, walletService } from '../services/api';
import './CampaignDetail.css';

function CampaignDetail({ isAuthenticated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [donating, setDonating] = useState(false);
  const [donationMessage, setDonationMessage] = useState('');

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await campaignService.getCampaignDetail(id);
      setCampaign(response.data);
    } catch (err) {
      setError('Failed to load campaign details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    setDonating(true);
    setError('');
    setDonationMessage('');

    try {
      const response = await walletService.donate({
        campaign_id: campaign.id,
        amount: parseFloat(donationAmount),
      });

      setDonationMessage(`✓ ${response.data.message} Progress: ${response.data.campaign_progress}%`);
      setDonationAmount('');
      
      // Refresh campaign data
      fetchCampaign();

      // Clear message after 3 seconds
      setTimeout(() => setDonationMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Donation failed. Please try again.');
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return <div className="loading page-container">Loading campaign...</div>;
  }

  if (!campaign) {
    return <div className="error-message page-container">Campaign not found</div>;
  }

  const progressPercentage = campaign.progress_percentage || 0;
  const daysLeft = campaign.end_date ? Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24)) : 'N/A';

  return (
    <div className="campaign-detail page-container">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="back-btn">← Back to Campaigns</button>

        <div className="campaign-content">
          {/* Campaign Image and Info */}
          <div className="campaign-main">
            <div className="campaign-image-large">
              {campaign.image ? (
                <img src={campaign.image} alt={campaign.product_name} />
              ) : (
                <div className="image-placeholder-large">📦</div>
              )}
            </div>

            <div className="campaign-info">
              <h1>{campaign.product_name}</h1>
              
              <div className="startup-info">
                <h3>{campaign.startup.company_name}</h3>
                <p>{campaign.startup.description}</p>
                {campaign.startup.website && (
                  <a href={campaign.startup.website} target="_blank" rel="noopener noreferrer">
                    Visit Website →
                  </a>
                )}
              </div>

              <div className="campaign-meta">
                <div className="meta-item">
                  <strong>Category:</strong> {campaign.startup.category.charAt(0).toUpperCase() + campaign.startup.category.slice(1)}
                </div>
                <div className="meta-item">
                  <strong>Type:</strong> {campaign.product_type === 'physical' ? 'Physical Product' : campaign.product_type === 'digital' ? 'Digital Product' : 'Service'}
                </div>
                {campaign.estimated_delivery && (
                  <div className="meta-item">
                    <strong>Expected Delivery:</strong> {new Date(campaign.estimated_delivery).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="description-section">
                <h2>About This Campaign</h2>
                <p>{campaign.description}</p>
                {campaign.detailed_description && (
                  <p>{campaign.detailed_description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Funding and Donation Sidebar */}
          <div className="campaign-sidebar">
            <div className="card funding-card">
              <div className="card-body">
                <div className="funding-goal">
                  <div className="amount-large">${campaign.current_amount.toLocaleString()}</div>
                  <div className="goal-text">raised of ${campaign.goal_amount.toLocaleString()}</div>
                </div>

                <div className="progress-bar large">
                  <div className="progress-fill" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
                </div>

                <div className="funding-stats-detail">
                  <div className="stat">
                    <div className="stat-value">{progressPercentage.toFixed(1)}%</div>
                    <div className="stat-label">Funded</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{campaign.backer_count}</div>
                    <div className="stat-label">Backers</div>
                  </div>
                  <div className="stat">
                    <div className="stat-value">{daysLeft}</div>
                    <div className="stat-label">Days Left</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Form */}
            <div className="card donation-card">
              <div className="card-body">
                <h3>Support This Campaign</h3>
                <p className="early-access">Early access price: ${campaign.early_access_price}</p>

                {error && <div className="error-message">{error}</div>}
                {donationMessage && <div className="success-message">{donationMessage}</div>}

                <form onSubmit={handleDonate} className="donation-form">
                  <div className="form-group">
                    <label htmlFor="donation">Donation Amount ($)</label>
                    <input
                      type="number"
                      id="donation"
                      name="donation"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Enter amount"
                      step="0.01"
                      min="0"
                      max="999999"
                      required={campaign.status === 'active'}
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <button
                    type="submit"
                    className="button-primary donation-btn"
                    disabled={donating || campaign.status !== 'active' || !isAuthenticated}
                  >
                    {donating ? 'Processing...' : isAuthenticated ? 'Donate Now' : 'Login to Donate'}
                  </button>
                </form>

                {!isAuthenticated && (
                  <p className="login-prompt">
                    <a href="/login">Login</a> to make a donation
                  </p>
                )}

                <div className="quick-amounts">
                  <button
                    className="quick-btn"
                    onClick={() => setDonationAmount('50')}
                    disabled={!isAuthenticated}
                  >
                    $50
                  </button>
                  <button
                    className="quick-btn"
                    onClick={() => setDonationAmount('100')}
                    disabled={!isAuthenticated}
                  >
                    $100
                  </button>
                  <button
                    className="quick-btn"
                    onClick={() => setDonationAmount('250')}
                    disabled={!isAuthenticated}
                  >
                    $250
                  </button>
                  <button
                    className="quick-btn"
                    onClick={() => setDonationAmount('500')}
                    disabled={!isAuthenticated}
                  >
                    $500
                  </button>
                </div>
              </div>
            </div>

            {/* Campaign Status */}
            <div className="campaign-status">
              <span className={`status-badge ${campaign.status}`}>
                {campaign.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetail;
