import React, { useState } from 'react';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); // This will prevent the blank or false email enetered by the user
    // This function will handle the login process when connected to the backend
    console.log('Login function triggered', { email, password });
  };

// THIS handleLogin FUNCTION WILL BE TRIGGERED WHEN THE LOGIN BUTTON IS CLICKED, AND CAN BE USED TO CONNECT TO THE BACKEND TO AUTHENTICATE THE USER
// THE LOGIN INFO WILL BE UPDATED IN THE BROWSER'S CONSOLE, WHICH CAN BE SEEN WHEN YOU ARE AT THE WEBPAGE AND PRESS F12, GOTO THE "CONSOLE" TAB

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required = {true}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required = {true}
          />
        </div>
        <button type="submit" className="auth-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
