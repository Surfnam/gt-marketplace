// Login.js
import React, { useState } from 'react';
import './Auth.css';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import User from '../backend/models/User';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const response = await fetch('http://localhost:5000/auth/signIn', {
        method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      body: new URLSearchParams({
        email, password,
      }),
      credentials: 'include',
      }) 

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'smt is wrong');
      }
      //console.log(await response.json());
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
      console.log(result);
      console.log("did smt print")
      console.log(result.user.email);
      console.log("did smt print")
      
      //const resJSON = await result.json();

      // const response = await axios.post('http://localhost:5000/auth/setAuth',{
      //   user: result.user
      // });
      const response = await fetch('http://localhost:5000/auth/setAuth', {
        method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      body: new URLSearchParams({
        email: result.user.email,
      }),
      credentials: 'include',
      }) 

      if (!response.ok) {
        //const error = await response.json();
        throw new Error(error.error || 'smt is wrong');
      }
      console.log('Google Sign-In successful:', result.user);
      //console.log(await response.json());
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
