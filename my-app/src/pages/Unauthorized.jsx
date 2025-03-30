import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-customBlue bg-opacity-10 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <FaLock className="mx-auto text-6xl text-[#679df8] mb-4" />
        <h1 className="text-2xl font-bold mb-3">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to access this page.
          Please log in with the correct account to continue.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[#679df8] text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Log In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full border border-[#679df8] text-[#679df8] py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign Up
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
