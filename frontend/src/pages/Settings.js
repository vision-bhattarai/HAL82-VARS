import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import './Settings.css';

function Settings({ user }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState(user?.profile_image || '');
  const [previewImage, setPreviewImage] = useState(user?.profile_image || '');
  
  const [profileData, setProfileData] = useState({
    username: user?.user?.username || '',
    email: user?.user?.email || '',
    first_name: user?.user?.first_name || '',
    last_name: user?.user?.last_name || '',
  });

  const [walletData, setWalletData] = useState({
    balance: 0,
    account_holder: '',
    account_number: '',
    bank_name: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWalletChange = (e) => {
    const { name, value } = e.target;
    setWalletData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('username', profileData.username);
      formData.append('email', profileData.email);
      formData.append('first_name', profileData.first_name);
      formData.append('last_name', profileData.last_name);
      
      if (profileImage instanceof File) {
        formData.append('profile_image', profileImage);
      }
      
      // This would be updated with actual API endpoint
      await userService.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // This would be updated with actual API endpoint
      await userService.updateWallet(walletData);
      setSuccess('Wallet information updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page page-container">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account and preferences</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </button>
          <button
            className={`settings-tab ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Wallet
          </button>
          <button
            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"></circle>
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
            </svg>
            Account
          </button>
        </div>

        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="profile-header">
                <h2>Profile Information</h2>
              </div>
              
              {/* Profile Picture Section */}
              <div className="profile-picture-section">
                <div className="profile-picture-wrapper">
                  <div className="profile-picture-container">
                    {previewImage ? (
                      <img src={previewImage} alt="Profile" className="profile-picture" />
                    ) : (
                      <div className="profile-picture-placeholder">
                        <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                    <button
                      type="button"
                      className="profile-picture-edit-btn"
                      onClick={handleProfileImageClick}
                      title="Change profile picture"
                    >
                      <svg className="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="profile-picture-info">
                    <h3>{profileData.first_name} {profileData.last_name}</h3>
                    <p>@{profileData.username}</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <p className="profile-picture-hint">Recommended: Square image, at least 400x400px</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      disabled
                      className="form-input"
                    />
                    <small>Username cannot be changed</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleProfileChange}
                      placeholder="Enter your first name"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleProfileChange}
                      placeholder="Enter your last name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="settings-section">
              <h2>Wallet Information</h2>
              <form onSubmit={handleWalletSubmit} className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="account_holder">Account Holder Name</label>
                    <input
                      type="text"
                      id="account_holder"
                      name="account_holder"
                      value={walletData.account_holder}
                      onChange={handleWalletChange}
                      placeholder="Enter account holder name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bank_name">Bank Name</label>
                    <input
                      type="text"
                      id="bank_name"
                      name="bank_name"
                      value={walletData.bank_name}
                      onChange={handleWalletChange}
                      placeholder="Enter bank name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="account_number">Account Number</label>
                    <input
                      type="text"
                      id="account_number"
                      name="account_number"
                      value={walletData.account_number}
                      onChange={handleWalletChange}
                      placeholder="Enter account number"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="balance">Current Balance</label>
                    <input
                      type="number"
                      id="balance"
                      name="balance"
                      value={walletData.balance}
                      onChange={handleWalletChange}
                      placeholder="Current balance"
                      className="form-input"
                      disabled
                    />
                    <small>Balance is read-only</small>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Wallet Info'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="settings-section">
              <h2>Account Settings</h2>
              <div className="account-info">
                <div className="info-card">
                  <div className="info-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="11" x2="12" y2="17"></line>
                      <polyline points="9 14 12 11 15 14"></polyline>
                    </svg>
                  </div>
                  <h3>Account Type</h3>
                  <p className="info-value">{user?.startup_profile ? 'Startup' : 'Investor'}</p>
                </div>
                <div className="info-card">
                  <div className="info-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h3>Member Since</h3>
                  <p className="info-value">
                    {user?.user?.date_joined
                      ? new Date(user.user.date_joined).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="info-card">
                  <div className="info-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3>Account Status</h3>
                  <p className="info-value active-status">Active</p>
                </div>
              </div>

              <div className="account-actions">
                <button className="button-secondary" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
