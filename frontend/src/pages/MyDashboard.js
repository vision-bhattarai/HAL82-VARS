import React, { useState, useEffect } from 'react';
import { campaignService, walletService, userService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './MyDashboard.css';

function LineChart({ points = [], width = 600, height = 200 }) {
  if (!points || points.length === 0) return <div className="chart-empty">No data</div>;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const stepX = width / (points.length - 1);

  const pointsAttr = points.map((p, i) => {
    const x = i * stepX;
    const y = height - ((p - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline fill="none" stroke="#ff7a45" strokeWidth="3" points={pointsAttr} />
      {points.map((p, i) => {
        const x = i * stepX;
        const y = height - ((p - min) / (max - min || 1)) * height;
        return <circle key={i} cx={x} cy={y} r="3" fill="#ff7a45" />;
      })}
    </svg>
  );
}

function MyDashboard({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const isStartup = Boolean(user?.startup_profile || user?.startup || user?.is_startup);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        // If user is startup owner, fetch their campaigns and stats
        if (isStartup) {
          const [myCampaignsRes, myStartupRes] = await Promise.all([
            campaignService.getMyCampaigns().catch(() => ({ data: [] })),
            userService.getMyStartup().catch(() => ({ data: null })),
          ]);

          // Build simple time-series from donations or views if present
          const campaigns = myCampaignsRes.data || [];
          // Aggregate donations and views per campaign (mock time series)
          const donations = campaigns.map(c => c.current_amount || 0);
          const views = campaigns.map(c => c.view_count || 0);

          setData({
            type: 'startup',
            campaigns,
            donations,
            views,
            startup: myStartupRes.data || user?.startup_profile || null,
          });
        } else {
          // For general/funder user: show transactions only
          const txRes = await walletService.getMyTransactions().catch(() => ({ data: [] }));
          const transactions = txRes.data || [];
          setData({ type: 'funder', transactions });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, isStartup]);

  if (loading) return <div className="page-container container"><div className="loading">Loading dashboard...</div></div>;

  return (
    <div className="my-dashboard page-container container">
      <div className="dashboard-head">
        <h1>My Dashboard</h1>
        <p>Track campaigns, investments, and activity in one place.</p>
      </div>
      {error && <div className="error-message">{error}</div>}

      {data.type === 'startup' ? (
        <>
          <h2 className="section-title">Startup Information</h2>
          <div className="dashboard-card" style={{ marginBottom: '1rem' }}>
            <h3>{data.startup?.company_name || 'Startup Company'}</h3>
            <p>Category: {data.startup?.category || 'N/A'}</p>
            <p>{data.startup?.description || 'No description available.'}</p>
            <p>Website: {data.startup?.website || 'Not provided'}</p>
          </div>

          <h2 className="section-title">My Campaigns</h2>
          <div className="cards-row">
            {data.campaigns && data.campaigns.length > 0 ? data.campaigns.map(c => (
              <div key={c.id} className="dashboard-card">
                <h3>{c.product_name}</h3>
                <p>Donations: ${c.current_amount?.toLocaleString() || 0}</p>
                <p>Views: {c.view_count || 0}</p>
              </div>
            )) : <p>No campaigns yet.</p>}
          </div>

          <div className="chart-panel">
            <div className="chart-block">
              <h4>Donations (per campaign)</h4>
              <LineChart points={(data.donations || [0])} />
            </div>
            <div className="chart-block">
              <h4>Views (per campaign)</h4>
              <LineChart points={(data.views || [0])} />
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="section-title">Recent Transactions</h2>
          <div className="tx-list">
            {(data.transactions || []).length > 0 ? (data.transactions || []).map((tx, index) => (
              <button
                key={tx.id || `${tx.created_at || 'tx'}-${index}`}
                type="button"
                className={`tx-item ${tx.campaign?.id || tx.target_id ? 'tx-item-clickable' : ''}`}
                onClick={() => {
                  const campaignId = tx.campaign?.id || tx.target_id;
                  if (campaignId) {
                    navigate(`/campaign/${campaignId}`);
                  }
                }}
              >
                <div className="tx-amount">{tx.amount ? `$${Number(tx.amount).toLocaleString()}` : '$0'}</div>
                <div className="tx-content">
                  <p className="tx-title">{tx.campaign?.product_name || tx.description || 'Transaction'}</p>
                  <p className="tx-meta">{tx.created_at ? new Date(tx.created_at).toLocaleString() : 'Recent activity'}</p>
                  {tx.campaign?.id || tx.target_id ? (
                    <p className="tx-action">View campaign →</p>
                  ) : null}
                </div>
              </button>
            )) : <p className="empty-state">No transactions yet.</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default MyDashboard;
