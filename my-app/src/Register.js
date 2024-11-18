// Register.js
import React, { useState } from 'react';
import './Auth.css';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register () {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setusername] = useState('');
  const [fullName, setfullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(''); // Clear any success messages

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      //console.log(email, password);
      const response = await fetch('http://localhost:5000/auth/createUser', {
        method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      body: new URLSearchParams({
        email, password, fullName , username
      }), 
      credentials: 'include',
      }) 

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'smt is wrong');
      }
      
      const userCredential = await response.json();
      console.log(userCredential.firebaseUser);
      //console.log(message);
      //console.log('User registered successfully:', userCredential.user);
      setSuccess('Registration successful! You can now log in.');

      // Send user data to MongoDB
      await sendUserDataToMongoDB(userCredential.firebaseUser);

      // Navigate to home page
      navigate('/home');
    } catch (error) {
      //console.log(userCredential);
      console.error('Error registering user:', error);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(''); // Clear previous errors
    setSuccess(''); // Clear any success messages

    try {
      const result = await signInWithPopup(auth, googleProvider);
      //const response = await result.json();
      console.log('Google Sign-In successful:', result.user);
      console.log('success email', result.user.email);

      // Send user data to MongoDB
      await sendUserDataToMongoDB(result.user);
      // console.log(response.user);
      // console.log("user data from prev");
      setSuccess('Registration successful via Google! You can now log in.');

      // Navigate to home page
      navigate('/home');
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      setError(error.message);
    }
  };

  const sendUserDataToMongoDB = async (user) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      body: new URLSearchParams({
        uid: user.uid, email: user.email,
      }), 
      credentials: 'include',
      })
      // const response = await axios.post('http://localhost:5000/api/users/register', {
      //   uid: user.uid,
      //   email: user.email,
      // });
      console.log('User data sent to MongoDB:', response.data);
    } catch (error) {
      console.error('Error sending user data to MongoDB:', error);
    }
  };

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
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="fullName"
            id="fullName"
            value={fullName}
            onChange={(e) => setfullName(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" className="auth-button">Register</button>
      </form>

      <div className="google-signin">
        <button onClick={handleGoogleSignIn} className="auth-button google-button">
          Register with Google
        </button>
      </div>
    </div>
  );
}
export default Register;
