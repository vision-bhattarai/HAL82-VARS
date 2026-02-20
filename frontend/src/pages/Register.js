import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

function Register({ onRegisterSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    citizenship_number: '',
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

    // Front-end validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number.trim(),
        citizenship_number: formData.citizenship_number.trim(),
      };

      console.log('Submitting registration data:', { ...registerData, password: '***' });
      await authService.register(registerData);
      
      // Auto-login after registration
      const loginResponse = await authService.login({
        username: formData.username,
        password: formData.password,
      });
      
      onRegisterSuccess(loginResponse.data.user);
      navigate('/dashboard');
    } catch (err) {
      // Extract error message from various possible response formats
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.data) {
        const data = err.response.data;
        // Check for field-specific errors (DRF format)
        if (typeof data === 'object') {
          for (const [key, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
              errorMessage = `${key}: ${value[0]}`;
              break;
            } else if (typeof value === 'string') {
              errorMessage = `${key}: ${value}`;
              break;
            }
          }
        }
        // Check for message field
        if (data.message) {
          errorMessage = data.message;
        }
        // Check for detail field
        if (data.detail) {
          errorMessage = data.detail;
        }
      }
      
      console.error('Registration error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container page-container">
      <div className="auth-form-wrapper">
        <div className="auth-card">
          <h1 className="form-title">Create Your Account</h1>
          
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Your first name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="citizenship_number">Citizenship Number (Optional)</label>
              <input
                type="text"
                id="citizenship_number"
                name="citizenship_number"
                value={formData.citizenship_number}
                onChange={handleChange}
                placeholder="Your citizenship/ID number"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="button-primary form-submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
