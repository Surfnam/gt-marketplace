// Register.js
import React, { useState } from "react";
import "../css/Auth.css";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ShoppingBag from "../images/1f6cd.png";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import GoogleLogo from "../images/Google logo.png";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear any success messages

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User registered successfully:", userCredential.user);
      setSuccess("Registration successful! You can now log in.");

      // Send user data to MongoDB
      const data = await sendUserDataToMongoDB(userCredential.user);
      console.log('RES DATA FROM MONGO', data);
      console.log(data.data.userId)
      localStorage.setItem("userId", data.data.userId);
      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear any success messages

    try {
      console.log('why login automatic?')
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result)
      console.log("Google Sign-In successful:", result.user);

      // Send user data to MongoDB
      const res = await sendUserDataToMongoDB(result.user);
      console.log(res)
      localStorage.setItem("userId", res.data.userId);
      setSuccess("Registration successful via Google! You can now log in.");

      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Error with Google sign-in:", error);
      setError(error.message);
    }
  };

  const sendUserDataToMongoDB = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/register",
        {
          uid: user.uid,
          email: user.email,
        }
      );
      console.log("User data sent to MongoDB:", response);
      return response;
    } catch (error) {
      console.error("Error sending user data to MongoDB:", error);
    }
  };

  return (
    <div className="min-h-screen bg-customBlue flex items-center justify-center">
      <div className="hidden md:flex flex-1 items-center justify-center">
        <img className="w-72 h-72" src={ShoppingBag} alt="" />
      </div>

      <div className="w-full max-w-lg bg-white p-16 mx-36 rounded-3xl shadow-lg">
        <div className="w-full">
          <Link to="/login" className="flex items-center text-customBlue mb-6 hover:text-slate-700 transition-colors">
            <FaArrowLeft className="mr-2" />
            <span>Back to Login</span>
          </Link>
        
          <div className="space-y-3 mb-8">
            <h1 className="text-2xl font-semibold text-customBlue">
              GT Marketplace
            </h1>
            <h2 className="text-2xl font-bold">Register</h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium" htmlFor="email">
                Email:
              </label>
              <input
                className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password:
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium pt-4"
              >
                Confirm Password:
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="input-group"></div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <button
              type="submit"
              className="w-full bg-customBlue text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Register
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              <img className="w-5 h-5 mr-2" src={GoogleLogo} alt="" />
              Register with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
