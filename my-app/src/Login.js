// src/Login.js
import React, { useState } from 'react';
import './Auth.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Authentication now needed for signing in.
      console.log('Login successful:', userCredential.user);
      // Handle successful login (e.g., navigate to a different page or show a success message)
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.message);
    }
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
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="auth-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
