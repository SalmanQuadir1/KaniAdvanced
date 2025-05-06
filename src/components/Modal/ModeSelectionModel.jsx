// src/components/ModeSelectionModal.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAppMode } from '../../redux/Slice/AppModeSlice';
import { useNavigate } from 'react-router-dom';
import { FaProductHunt } from "react-icons/fa6";
import { MdAccountBalanceWallet } from "react-icons/md";
import kaniimage from '/img/kaniimage.jpg'; // Ensure path is correct and image is in "public/img" or set up properly

const ModeSelectionModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleSubmit = () => {
    if (selectedMode) {
      dispatch(setAppMode(selectedMode));
      navigate('/home');
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Background Image */}
      <img
        src={kaniimage}
        alt="Background"
        className="w-full h-full object-cover"
      />

      {/* Overlay with Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-12 text-slate-300">Welcome To Kaani</h1>

        {/* Modal Content */}
        <div className="bg-white/10 rounded-lg p-10 shadow-2xl w-full max-w-3xl text-white text-center">
          <h2 className="text-3xl font-bold mb-10">Choose One</h2>
          <div className="flex justify-center gap-10">
            {/* Production Mode */}
            <div
              onClick={() => handleModeSelect('production')}
              className={`flex flex-col items-center p-6 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedMode === 'production'
                  ? 'ring-4 ring-red-400 bg-white/20'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <FaProductHunt className="text-[#DA552F] w-24 h-24 mb-4" />
              <p className="text-xl font-semibold">Production Mode</p>
            </div>

            {/* Accounts Mode */}
            <div
              onClick={() => handleModeSelect('accounts')}
              className={`flex flex-col items-center p-6 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedMode === 'accounts'
                  ? 'ring-4 ring-yellow-300 bg-white/20'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <MdAccountBalanceWallet className="text-yellow-300 w-24 h-24 mb-4" />
              <p className="text-xl font-semibold">Accounts Mode</p>
            </div>
          </div>

          {/* Centered Continue Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedMode}
              className={`px-8 py-3 rounded-lg text-lg font-semibold transition ${
                selectedMode
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectionModal;
