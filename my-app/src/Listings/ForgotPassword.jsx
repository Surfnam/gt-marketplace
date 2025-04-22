import React, { useState } from "react";
import "../css/Auth.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import ShoppingBag from "../images/1f6cd.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Please check your inbox.");
      setEmail("");
    } catch (error) {
      console.error("Error sending reset email:", error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-customBlue flex items-center justify-center">
      <div className="hidden md:flex flex-1 items-center justify-center">
        <img className="w-72 h-72" src={ShoppingBag} alt="" />
      </div>

      <div className="w-full max-w-lg bg-white p-16 mx-36 rounded-3xl shadow-lg">
        <div className="space-y-6 mb-8">
          <h1 className="text-2xl font-semibold text-customBlue">
            GT Marketplace
          </h1>
          <h2 className="text-2xl font-bold">Reset Password</h2>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
              placeholder="johndoe@gmail.com"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-customBlue text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Send Reset Link
          </button>

          <p className="text-sm text-center">
            {"Remember your password? "}
            <Link className="text-blue-500 hover:underline" to="/login">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;