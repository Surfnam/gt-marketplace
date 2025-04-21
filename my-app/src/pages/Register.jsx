import React, { useState } from "react";
import "../css/Auth.css";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ShoppingBag from "../images/1f6cd.png";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import GoogleLogo from "../images/Google logo.png";
import { FaArrowLeft } from "react-icons/fa";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const sendUserDataToMongoDB = (user) =>
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, {
      uid: user.uid,
      email: user.email,
    });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const res = await sendUserDataToMongoDB(cred.user);
      localStorage.setItem("userId", res.data.userId);
      if (res.data.isNewUser) {
        localStorage.setItem("justRegistered", "true");
        navigate("/profile");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setSuccess("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await sendUserDataToMongoDB(result.user);
      localStorage.setItem("userId", res.data.userId);
      if (res.data.isNewUser) {
        localStorage.setItem("justRegistered", "true");
        navigate("/profile");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-customBlue flex flex-col md:flex-row items-center justify-center px-4 py-8">
      {/* illustration */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <img src={ShoppingBag} alt="" className="w-72 h-72" />
      </div>

      {/* form card */}
      <div className="w-full max-w-md bg-white px-6 py-10 md:p-16 md:mx-36 rounded-3xl shadow-lg">
        <Link
          to="/login"
          className="flex items-center text-customBlue mb-6 hover:text-slate-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Login
        </Link>

        <div className="space-y-3 mb-8">
          <h1 className="text-2xl font-semibold text-customBlue">
            GT Marketplace
          </h1>
          <h2 className="text-2xl font-bold">Register</h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
            />
          </div>

          {/* password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* confirm */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          {/* register */}
          <button
            type="submit"
            className="w-full bg-customBlue text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Register
          </button>

          {/* divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            <img src={GoogleLogo} alt="" className="w-5 h-5 mr-2" />
            Register with Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
