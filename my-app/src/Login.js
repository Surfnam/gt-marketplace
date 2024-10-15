// Login.js
import React, { useState } from 'react';
import './Auth.css';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user);
      navigate('/'); // Navigate to home page after successful login
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(''); // Clear previous errors
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google Sign-In successful:', result.user);
      navigate('/'); // Navigate to home page after successful login
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      setError(error.message);
    }
  };

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

      <div className="google-signin">
        <button onClick={handleGoogleSignIn} className="auth-button google-button">
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
