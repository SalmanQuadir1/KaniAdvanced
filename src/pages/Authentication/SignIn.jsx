import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signInFailure, signInSuccess, signinStart } from '../../redux/Slice/UserSlice';
import { SIGNIN_URL } from '../../Constants/utils';
import './style.css';
import logoImage from '/img/logo.png';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaChartLine, FaCalculator, FaFileInvoiceDollar } from 'react-icons/fa';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [error, setError] = useState('');
  const [formData, setformData] = useState({
    username: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please Fill All the Fields');
      return;
    }
    setIsLoading(true);
    try {
      dispatch(signinStart());
      const res = await fetch(SIGNIN_URL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      } else {
        setError('Invalid Credentials');
        setIsLoading(false);
      }
    } catch (error) {
      dispatch(signInFailure());
      setError('Invalid Credentials');
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Elegant Dark Gradient Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        
        {/* Animated financial graphs pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="graph-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 L20 30 L40 70 L60 20 L80 60 L100 40" stroke="rgba(255,255,255,0.3)" fill="none" strokeWidth="1"/>
                <path d="M0 80 L30 60 L50 90 L70 40 L90 70" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="1"/>
                <circle cx="20" cy="30" r="2" fill="rgba(255,255,255,0.4)"/>
                <circle cx="40" cy="70" r="2" fill="rgba(255,255,255,0.4)"/>
                <circle cx="60" cy="20" r="2" fill="rgba(255,255,255,0.4)"/>
                <circle cx="80" cy="60" r="2" fill="rgba(255,255,255,0.4)"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#graph-pattern)"/>
          </svg>
        </div>

        {/* Professional geometric shapes */}
        <div className="absolute inset-0">
          {/* Large subtle shapes */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating business icons */}
        <div className="absolute inset-0 overflow-hidden">
          <FaChartLine className="absolute top-20 left-[10%] text-white/5 text-6xl animate-float-slow" />
          <FaCalculator className="absolute bottom-20 right-[15%] text-white/5 text-6xl animate-float-delayed" />
          <FaFileInvoiceDollar className="absolute top-40 right-[25%] text-white/5 text-6xl animate-float" />
        </div>

        {/* Subtle rotating ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[600px] h-[600px] border border-white/5 rounded-full animate-rotate-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full animate-rotate-reverse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Decorative corner elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 border-l-2 border-t-2 border-blue-500/30 rounded-tl-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 border-r-2 border-b-2 border-blue-500/30 rounded-br-3xl"></div>

        {/* Login Card */}
        <div className="relative">
          {/* Card glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          
          {/* Main card */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Logo with elegant frame */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Decorative rings */}
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-30 blur-sm"></div>
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl">
                  <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                    <img
                      src={logoImage}
                      alt="Logo"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-800 mb-2">
                Welcome Back
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm tracking-wide">
                ACCOUNTS & PRODUCTION PORTAL
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 rounded-r-lg" role="alert">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 tracking-wide">
                  USERNAME
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                  </div>
                  <input
                    value={formData.username}
                    onChange={(e) =>
                      setformData({ ...formData, username: e.target.value })
                    }
                    type="text"
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-3 py-3 bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-focus-within:w-full transition-all duration-500"></div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 tracking-wide">
                  PASSWORD
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                  </div>
                  <input
                    value={formData.password}
                    onChange={(e) =>
                      setformData({ ...formData, password: e.target.value })
                    }
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all duration-300 text-gray-700 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 focus:outline-none transition-colors duration-300"
                  >
                    {isPasswordVisible ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-focus-within:w-full transition-all duration-500"></div>
                </div>
                <p className="mt-2 text-xs text-gray-400 tracking-wide">
                  Minimum 6 characters with 1 capital letter
                </p>
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                {/* <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-purple-600 transition-colors duration-300">
                  Forgot Password?
                </Link> */}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      SIGNING IN...
                    </>
                  ) : (
                    'SIGN IN'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

          
            {/* <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-purple-600 transition-colors duration-300">
                  Contact Administrator
                </Link>
              </p>
            </div> */}

            {/* System status indicator */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">System Status: Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;