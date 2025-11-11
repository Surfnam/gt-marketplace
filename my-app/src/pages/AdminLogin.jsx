import React, { useState } from "react";
import "../css/Auth.css";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const isAdminEmail = (em) => {
    console.log("🔍 REACT_APP_ADMIN_EMAILS:", process.env.REACT_APP_ADMIN_EMAILS);
  console.log("🔍 Input email:", em);

    const list = (process.env.REACT_APP_ADMIN_EMAILS || "").toLowerCase();
    console.log("🔍 Processed list:", list);
    if (!list) return false;
    const allowed = list
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return allowed.includes((em || "").toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!isAdminEmail(cred.user?.email)) {
        await signOut(auth);
        throw new Error("You are not authorized to access the admin area.");
      }
      // Pull user document from Mongo and store userId (same as normal login flow)
      const data = await sendUserDataToMongoDB(cred.user);
      if (!data?.user?.[0]) {
        await signOut(auth);
        throw new Error("Admin account not provisioned in database.");
      }
      localStorage.setItem("userId", data.user[0]._id);
      // Successful admin login – redirect to home for now (replace with /admin when dashboard exists)
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-customBlue flex flex-col md:flex-row items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white px-6 py-10 md:p-12 rounded-3xl shadow-lg">
        <div className="space-y-2 mb-6 text-center">
          <h1 className="text-2xl font-semibold text-customBlue">GT Marketplace</h1>
          <h2 className="text-2xl font-bold">Admin Log In</h2>
          <p className="text-sm text-gray-500">Restricted access – authorized admins only.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-customBlue text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Log In
          </button>

          <p className="text-sm text-center">
            Not an admin? <Link to="/login" className="text-blue-500 hover:underline">Go to user login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
