import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { auth } from '../firebase';
import '../css/Navbar.css';

function Navbar({ navigateToLogin, navigateToRegister, user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

  // Close the mobile menu automatically whenever a link is clicked
  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={handleMenuClose}>
          GT Marketplace
        </Link>

        {/* Hamburger Icon (visible on mobile) */}
        <div className="menu-icon" onClick={handleMenuToggle}>
          {/* This can be a hamburger icon or just text; style as needed */}
          &#9776;
        </div>

        {/* Navigation Links */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active-menu' : ''}`}>
          <li className="navbar-item">
            <NavLink
              exact="true"
              to="/"
              activeclassname="active"
              className="navbar-link"
              onClick={handleMenuClose}
            >
              Home
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink
              to="/about-us"
              activeclassname="active"
              className="navbar-link"
              onClick={handleMenuClose}
            >
              About Us
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink
              to="/profile"
              activeclassname="active"
              className="navbar-link"
              onClick={handleMenuClose}
            >
              My Profile
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink
              to="/contact"
              activeclassname="active"
              className="navbar-link"
              onClick={handleMenuClose}
            >
              Contact
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink
              to="/chat"
              activeclassname="active"
              className="navbar-link"
              onClick={handleMenuClose}
            >
              Chat
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink
              to="/payment"
              activeclassname="active"
              className="navbar-link"
              onClick={handleMenuClose}
            >
              Make Payment
            </NavLink>
          </li>

          {/* Buttons for logged in vs not logged in */}
          <div className="navbar-buttons">
            {user ? (
              <>
                <span className="navbar-welcome">Welcome, {user.email}!</span>
                <button onClick={handleLogout} className="navbar-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={navigateToLogin} className="navbar-login">
                  Log In
                </button>
                <button onClick={navigateToRegister} className="navbar-button">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
