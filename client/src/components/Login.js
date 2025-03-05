import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [loginUrl, setLoginUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoginUrl = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
// Then use API_URL in your request
const response = await axios.get(`${API_URL}/api/auth/google/url`);
        //const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/google/url`);
        setLoginUrl(response.data.url);
      } catch (err) {
        console.error('Error fetching login URL:', err);
        setError('Failed to connect to authentication service. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoginUrl();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Letter Creator</h1>
        <p>Create and save letters directly to your Google Drive</p>
        <a href={loginUrl} className="google-login-btn">
          <img src="/google-icon.svg" alt="Google logo" />
          Sign in with Google
        </a>
      </div>
    </div>
  );
};


export default Login;