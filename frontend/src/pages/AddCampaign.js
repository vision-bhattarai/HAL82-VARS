import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/api';
import './CampaignForm.css';

function AddCampaign() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: '',
    product_type: 'physical',
    description: '',
    detailed_description: '',
    goal_amount: '',
    early_access_price: '',
    estimated_delivery: '',
    image: null,
    end_date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.product_name || !formData.goal_amount || !formData.early_access_price) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const campaignFormData = new FormData();
      campaignFormData.append('product_name', formData.product_name);
      campaignFormData.append('product_type', formData.product_type);
      campaignFormData.append('description', formData.description);
      campaignFormData.append('detailed_description', formData.detailed_description);
      campaignFormData.append('goal_amount', formData.goal_amount);
      campaignFormData.append('early_access_price', formData.early_access_price);
      if (formData.estimated_delivery) campaignFormData.append('estimated_delivery', formData.estimated_delivery);
      if (formData.end_date) campaignFormData.append('end_date', formData.end_date);
      if (formData.image) campaignFormData.append('image', formData.image);

      await campaignService.createCampaign(campaignFormData);
      navigate('/startup-portal');
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.message) {
        setError(responseData.message);
      } else if (responseData?.error) {
        setError(responseData.error);
      } else if (typeof responseData === 'object' && responseData !== null) {
        const firstKey = Object.keys(responseData)[0];
        const firstValue = firstKey ? responseData[firstKey] : null;
        if (Array.isArray(firstValue) && firstValue.length > 0) {
          setError(firstValue[0]);
        } else {
          setError('Failed to create campaign');
        }
      } else {
        setError('Failed to create campaign');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campaign-form-page page-container">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1>Create New Campaign</h1>
        <p className="form-subtitle">Launch your startup campaign and raise funds</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="campaign-form">
          <div className="form-group">
            <label htmlFor="product_name">Product Name *</label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="Enter your product name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_type">Product Type *</label>
            <select
              id="product_type"
              name="product_type"
              value={formData.product_type}
              onChange={handleChange}
              required
            >
              <option value="physical">Physical Product</option>
              <option value="digital">Digital Product</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your product"
              required
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="detailed_description">Detailed Description</label>
            <textarea
              id="detailed_description"
              name="detailed_description"
              value={formData.detailed_description}
              onChange={handleChange}
              placeholder="More details about your product and campaign"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="goal_amount">Funding Goal ($) *</label>
              <input
                type="number"
                id="goal_amount"
                name="goal_amount"
                value={formData.goal_amount}
                onChange={handleChange}
                placeholder="Target amount"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="early_access_price">Early Access Price ($) *</label>
              <input
                type="number"
                id="early_access_price"
                name="early_access_price"
                value={formData.early_access_price}
                onChange={handleChange}
                placeholder="Price for backers"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimated_delivery">Estimated Delivery Date</label>
              <input
                type="date"
                id="estimated_delivery"
                name="estimated_delivery"
                value={formData.estimated_delivery}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">Campaign End Date</label>
              <input
                type="datetime-local"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Campaign Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />
            <small>Recommended size: 800x600px</small>
          </div>

          <button
            type="submit"
            className="button-primary form-submit"
            disabled={loading}
          >
            {loading ? 'Creating Campaign...' : 'Create Campaign'}
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

export default AddCampaign;
