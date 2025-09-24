import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { auth } from "../firebase";
import "../css/Navbar.css";
import {
  FaHome,
  FaInfoCircle,
  FaUser,
  FaEnvelope,
  FaComments,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";

function Navbar({ navigateToLogin, navigateToRegister, user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef(null);

  /* fetch profile pic */
  useEffect(() => {
    const fetchPic = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${user.email}`
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfilePicture(data.user[0]?.profilePicture);
        setIsAdmin(data.user[0]?.role === 'admin');
      } catch (err) {
        console.error("Error fetching profile picture:", err);
      }
    };
    fetchPic();
  }, [user]);

  /* close dropdown when clicking outside */
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("userId");
      navigateToLogin();
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          GT Marketplace
        </Link>

        {/* hamburger (mobile) */}
        <div
          className="hamburger"
          onClick={() => setIsMobileMenuOpen((p) => !p)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul
          className={`navbar-menu ${
            isMobileMenuOpen ? "active" : ""
          }`}
        >
          {[
            { to: "/", icon: <FaHome />, text: "Home" },
            { to: "/about-us", icon: <FaInfoCircle />, text: "About Us" },
            { to: "/contact", icon: <FaEnvelope />, text: "Contact" },
            { to: "/chat", icon: <FaComments />, text: "Chat" },
          ].map(({ to, icon, text }) => (
            <li key={to} className="navbar-item">
              <NavLink
                to={to}
                className="navbar-link"
                activeclassname="active"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {icon} {text}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-buttons">
          {user ? (
            <div className="profile-dropdown" ref={dropdownRef}>
              <div
                className="profile-trigger"
                onClick={() => setIsDropdownOpen((p) => !p)}
              >
                <img
                  src={profilePicture}
                  alt="profile"
                  className="profile-avatar profile-img"
                />
                <span className="profile-username">{user.email}</span>
              </div>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUser className="dropdown-icon" /> Profile
                  </Link> 
                  <Link
                    to="/admin"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaShieldAlt className="dropdown-icon" /> Admin Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="dropdown-item"
                  >
                    <FaSignOutAlt className="dropdown-icon" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={navigateToLogin} className="navbar-login">
                Log&nbsp;In
              </button>
              <button onClick={navigateToRegister} className="navbar-button">
                Sign&nbsp;Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
