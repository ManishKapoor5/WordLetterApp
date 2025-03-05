import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = ({ user }) => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/letters`,
          {
            params: { accessToken }
          }
        );
        setLetters(response.data.letters);
      } catch (err) {
        console.error('Error fetching letters:', err);
        setError('Failed to load your letters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  if (loading) {
    return <div className="loading">Loading your letters...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome, {user?.name || 'User'}</h1>
        <Link to="/editor" className="new-letter-btn">
          Create New Letter
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="letters-container">
        <h2>Your Letters</h2>
        {letters.length === 0 ? (
          <div className="no-letters">
            <p>You haven't created any letters yet.</p>
            <Link to="/editor" className="start-writing-btn">
              Start Writing
            </Link>
          </div>
        ) : (
          <div className="letters-grid">
            {letters.map((letter) => (
              <div key={letter.id} className="letter-card">
                <h3>{letter.title || letter.name}</h3>
                <p>Created: {new Date(letter.createdTime).toLocaleDateString()}</p>
                <div className="letter-actions">
                  <Link to={`/editor/${letter.id}`} className="edit-btn">
                    Edit
                  </Link>
                  <a href={letter.webViewLink} target="_blank" rel="noopener noreferrer" className="view-btn">
                    View in Drive
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


export default Home;