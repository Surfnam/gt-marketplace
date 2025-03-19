import React from 'react'
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function PleaseLogin({isOpen, onClose}) {
    const navigate = useNavigate();

    if (!isOpen) return null;
    
  return (
    <div className="fixed inset-0 bg-customBlue bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <FaUserCircle className="mx-auto text-6xl text-[#679df8] mb-4" />
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login or create an account to access this feature.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="w-full bg-[#679df8] text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Log In
          </button>
          
          <button
            onClick={() => {
              onClose();
              navigate('/register');
            }}
            className="w-full border border-[#679df8] text-[#679df8] py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign Up
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}

export default PleaseLogin
