import React, { useState } from "react";
import "./Auth.css";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import GoogleLogo from "../assets/images/Google logo.png";
import ShoppingBag from "../assets/images/1f6cd.png";
import { FaUserSecret } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* fetch user meta from backend */
  const sendUserDataToMongoDB = async (user) => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/profile/${user.email}`
    );
    if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
    return res.json();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const data = await sendUserDataToMongoDB(cred.user);
      if (!data?.user?.[0]) throw new Error("You have not registered this account yet");
      localStorage.setItem("userId", data.user[0]._id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const data = await sendUserDataToMongoDB(result.user);
      if (!data?.user?.[0]) throw new Error("You have not registered this account yet");
      localStorage.setItem("userId", data.user[0]._id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem("userId", "guest");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-customBlue flex flex-col md:flex-row items-center justify-center px-4 py-8">
      {/* illustration – hidden on phones */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <img src={ShoppingBag} alt="shopping bag" className="w-72 h-72" />
      </div>

      {/* form card */}
      <div className="w-full max-w-md bg-white px-6 py-10 md:p-16 md:mx-36 rounded-3xl shadow-lg">
        <div className="space-y-6 mb-8">
          <h1 className="text-2xl font-semibold text-customBlue">
            GT Marketplace
          </h1>
          <h2 className="text-2xl font-bold">Log In</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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

          {/* remember / forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-slate-600 focus:ring-slate-600"
              />
              <span className="text-sm">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* primary login */}
          <button
            type="submit"
            className="w-full bg-customBlue text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Log In
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

          {/* Google sign‑in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            <img src={GoogleLogo} alt="" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>

          {/* guest */}
          <button
            onClick={handleGuestLogin}
            className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            <FaUserSecret className="w-5 h-5 mr-2" />
            Continue as Guest
          </button>

          {/* signup link */}
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
