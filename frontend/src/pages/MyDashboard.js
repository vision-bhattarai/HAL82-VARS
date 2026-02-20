import React, { useState, useEffect } from 'react';
import { campaignService, walletService, userService } from '../services/api';
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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        // If user is startup owner, fetch their campaigns and stats
        if (user?.startup_profile || user?.startup) {
          const [myCampaignsRes, myStartupRes] = await Promise.all([
            campaignService.getMyCampaigns().catch(() => ({ data: [] })),
            userService.getMyStartup().catch(() => ({ data: null })),
          ]);

          // Build simple time-series from donations or views if present
          const campaigns = myCampaignsRes.data || [];
          // Aggregate donations and views per campaign (mock time series)
          const donations = campaigns.map(c => c.current_amount || 0);
          const views = campaigns.map(c => c.view_count || 0);

          setData({ type: 'startup', campaigns, donations, views, startup: myStartupRes.data });
        } else {
          // For general/funder user: show transactions and startups they've backed
          const txRes = await walletService.getMyTransactions().catch(() => ({ data: [] }));
          const transactions = txRes.data || [];
          // Extract unique startups/campaigns from transactions
          const backed = transactions.map(t => ({ id: t.campaign?.id || t.target_id, name: t.campaign?.product_name || t.description || 'Unknown' }));
          setData({ type: 'funder', transactions, backed });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (loading) return <div className="page-container container"><div className="loading">Loading dashboard...</div></div>;

  return (
    <div className="my-dashboard page-container container">
      <h1>My Dashboard</h1>
      {error && <div className="error-message">{error}</div>}

      {data.type === 'startup' ? (
        <>
          <h2>My Campaigns</h2>
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
          <h2>Your Investments</h2>
          <div className="cards-row">
            {data.backed && data.backed.length > 0 ? data.backed.map((b, i) => (
              <div key={i} className="dashboard-card">
                <h3>{b.name}</h3>
              </div>
            )) : <p>You haven't invested in any campaigns yet.</p>}
          </div>
          <h3>Recent Transactions</h3>
          <ul className="tx-list">
            {(data.transactions || []).map(tx => (
              <li key={tx.id || Math.random()} className="tx-item">
                <strong>{tx.amount ? `$${tx.amount}` : ''}</strong> — {tx.campaign?.product_name || tx.description || 'Transaction'}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default MyDashboard;
