import React from 'react';
import logo from './logo.svg';
import './App.css';
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
