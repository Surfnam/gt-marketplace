import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AboutUs from './components/AboutUs';
import Home from './components/Home';
import Contact from './components/Contact'; 
import Feedback from './components/Feedback';
import logo from './logo.svg';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>  
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>

    <div className="App">
      <header className="App-header">
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <button
            onClick={navigateToLogin}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
          <button
            onClick={navigateToRegister}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;