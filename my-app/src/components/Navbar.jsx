import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth
import '../css/Navbar.css';
import { FaHome, FaInfoCircle, FaUser, FaEnvelope, FaComments, FaCreditCard, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

function Navbar({ navigateToLogin, navigateToRegister, user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('userId');
      console.log('User logged out successfully');
      navigateToLogin();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GT Marketplace
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <NavLink exact to="/" activeClassName="active" className="navbar-link">
              <FaHome className="navbar-icon" /> Home
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/about-us" activeClassName="active" className="navbar-link">
              <FaInfoCircle className="navbar-icon" /> About Us
            </NavLink>
          </li>     
          <li className="navbar-item">
            <NavLink to="/contact" activeClassName="active" className="navbar-link">
              <FaEnvelope className="navbar-icon" /> Contact
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/chat" activeClassName="active" className="navbar-link">
              <FaComments className="navbar-icon" /> Chat
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/payment" activeClassName="active" className="navbar-link">
              <FaCreditCard className="navbar-icon" /> Payment
            </NavLink>
          </li>
        </ul>
        <div className="navbar-buttons">
          {user ? (
            <div className="profile-dropdown">
              <div className="profile-trigger" onClick={toggleDropdown}>
                <FaUserCircle className="profile-avatar" />
                <span className="profile-username">{user.email}</span>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <FaUser className="dropdown-icon" />
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    <FaSignOutAlt className="dropdown-icon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={navigateToLogin}
                className="navbar-login"
              >
                Log In
              </button>
              <button
                onClick={navigateToRegister}
                className="navbar-button"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;