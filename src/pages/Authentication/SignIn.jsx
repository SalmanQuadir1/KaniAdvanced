import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signInFailure, signInSuccess, signinStart } from '../../redux/Slice/UserSlice';
import { SIGNIN_URL } from '../../Constants/utils';
import './style.css'; // Ensure custom styling if needed
import backgroundImage from '/img/loginimg.jpg';
import logoImage from '/img/bg123.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.persisted?.user);
  const [error, setError] = useState('');
  const [formData, setformData] = useState({
    username: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility toggle

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please Fill All the Fields');
      return;
    }
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

        // console.log(res,"responseeeeeee");
        dispatch(signInSuccess(data));



        navigate('/');
      } else {
        console.log("i am here");
        setError('Invalid Credentials');
      }
    } catch (error) {
      dispatch(signInFailure());
      setError('Invalid Credentials');
      console.log("i am not here");
      console.error(error);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Side Background Image */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          objectFit: 'cover',
        }}
      ></div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center text-center">
            <img
              src={`${logoImage}`}
              alt="Logo_img"
              className="mix-blend-multiply"
            ></img>
          </div>

          <h2 className="text-xl font-semibold text-primary  mb-2">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="flex items-center bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded mb-4"
                role="alert"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9z"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Username
              </label>
              <input
                value={formData.username}
                onChange={(e) =>
                  setformData({ ...formData, username: e.target.value })
                }
                type="text"
                placeholder="Enter your Username"
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-primary transition"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                value={formData.password}
                onChange={(e) =>
                  setformData({ ...formData, password: e.target.value })
                }
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="6+ Characters, 1 Capital letter"
                className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-primary transition"
              />
              {/* Eye Icon for toggling password visibility */}
              <span
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-2/3 transform -translate-y-1/2 cursor-pointer"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-all duration-300"
            >
              Sign in
            </button>

          
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
