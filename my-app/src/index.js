import React from 'react';
import './index.css';
import App from './App';
import Login from './Login';
import Register from './Register';
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import Feedback from "./components/Feedback";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import Chat from './Chat';
import Home from './Home';
import Navbar from './components/Navbar';

const container = document.getElementById('root');
const root = createRoot(container);

function Main() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <>
      <Navbar navigateToLogin={navigateToLogin} navigateToRegister={navigateToRegister} />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

root.render(
  <Router>
    <Main />
  </Router>
);