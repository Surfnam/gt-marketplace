import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { auth } from '../firebase'; // Import Firebase auth
import '../css/Navbar.css';
import { FaHome, FaInfoCircle, FaUser, FaEnvelope, FaComments, FaCreditCard, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

function Navbar({ navigateToLogin, navigateToRegister, user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`http://localhost:3001/api/users/profile/${user.email}`);
          if (!response.ok) throw new Error("Failed to fetch user info from email");
          const data = await response.json();
          setProfilePicture(data.user[0]?.profilePicture);
        } catch (error) {
          console.error("Error fetching profile picture by email:", error);
        }
      }
    };

    fetchProfilePicture();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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
            <NavLink to="/" activeClassName="active" className="navbar-link">
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
        </ul>
        <div className="navbar-buttons">
          {user ? (
            <div className="profile-dropdown" ref={dropdownRef}>
              <div className="profile-trigger" onClick={toggleDropdown}>
                <img
                  src={profilePicture}
                  alt="Profile Picture"
                  className='profile-avatar profile-img'
                />
                <span className="profile-username">{user.email}</span>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    <FaUser className="dropdown-icon" />
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }} 
                    className="dropdown-item" >
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