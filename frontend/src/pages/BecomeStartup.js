import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import './CampaignForm.css';

function BecomeStartup({ onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    category: 'tech',
    description: '',
    website: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.company_name || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await userService.becomeStartup(formData);
      onSuccess(response.data);
    } catch (err) {
      const responseData = err.response?.data;

      if (responseData?.message) {
        setError(responseData.message);
      } else if (responseData?.website?.[0]) {
        setError(responseData.website[0]);
      } else if (responseData?.company_name?.[0]) {
        setError(responseData.company_name[0]);
      } else if (Array.isArray(responseData?.non_field_errors) && responseData.non_field_errors.length > 0) {
        setError(responseData.non_field_errors[0]);
      } else {
        setError('Failed to register as startup');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campaign-form-page page-container">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1>Register as a Startup</h1>
        <p className="form-subtitle">Upgrade your account to start fundraising for your product</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="campaign-form">
          <div className="form-group">
            <label htmlFor="company_name">Company Name *</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Your company name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Industry Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="tech">Technology</option>
              <option value="health">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="ecommerce">E-commerce</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Company Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your company and your vision"
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Company Website (Optional)</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourcompany.com"
            />
          </div>

          <button
            type="submit"
            className="button-primary form-submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register as Startup'}
          </button>

          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate('/dashboard')}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default BecomeStartup;
