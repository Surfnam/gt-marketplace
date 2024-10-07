import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css'; 

function Navbar({ navigateToLogin, navigateToRegister }) {
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
            <NavLink to="/feedback" activeClassName="active" className="navbar-link">
              Feedback
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/contact" activeClassName="active" className="navbar-link">
              Contact
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/Chat" activeClassName="active" className="navbar-link">
              Chat
            </NavLink>
          </li>
        </ul>
        <div className="navbar-buttons">
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;