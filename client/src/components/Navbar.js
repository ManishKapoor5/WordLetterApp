import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Letter Creator
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <div className="user-info">
              <img src={user.picture} alt={user.name} className="user-avatar" />
              <span className="user-name">{user.name}</span>
            </div>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};


export default Navbar;