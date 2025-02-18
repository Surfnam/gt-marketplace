import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth
import '../css/Navbar.css';

function Navbar({ navigateToLogin, navigateToRegister, user }) {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully');
      navigateToLogin();
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
              Home
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/about-us" activeClassName="active" className="navbar-link">
              About Us
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/profile" activeClassName="active" className="navbar-link">
              My Profile
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/contact" activeClassName="active" className="navbar-link">
              Contact
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/chat" activeClassName="active" className="navbar-link">
              Chat
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/payment" activeClassName="active" className="navbar-link">
              Make Payment
            </NavLink>
          </li>
        </ul>
        <div className="navbar-buttons">
          {user ? (
            <>
              <span className="navbar-welcome" style={{ color: 'white' }}>Welcome, {user.email}!</span>
              <button
                onClick={handleLogout}
                className="navbar-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={navigateToLogin}
                className="navbar-button"
              >
                Login
              </button>
              <button
                onClick={navigateToRegister}
                className="navbar-button"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;