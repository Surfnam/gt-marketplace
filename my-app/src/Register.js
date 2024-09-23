import React, { useState } from 'react';
import './Auth.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault(); // This will prevent the blank or false email enetered by the user
    // This function will handle the registration process when connected to the backend
    console.log('Register function triggered', { email, password, confirmPassword });
  };

// THIS handleRegister FUNCTION WILL BE TRIGGERED WHEN THE LOGIN BUTTON IS CLICKED, AND CAN BE USED TO CONNECT TO THE BACKEND TO AUTHENTICATE THE USER
// THE LOGIN INFO WILL BE UPDATED IN THE BROWSER'S CONSOLE, WHICH CAN BE SEEN WHEN YOU ARE AT THE WEBPAGE AND PRESS F12, GOTO THE "CONSOLE" TAB
// If needed, a confirmation email can be sent to the user's email address to verify the user's email address
  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="auth-form">
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
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">Register</button>
      </form>
    </div>
  );
}

export default Register;
