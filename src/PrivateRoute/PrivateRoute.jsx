// src/routes/PrivateRoute.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { signoutSuccess } from '../redux/Slice/UserSlice';
import ModeSelectionModal from '../components/Modal/ModeSelectionModel';

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.persisted.user);
  const appMode = useSelector((state) => state.persisted.appMode?.mode);
  const dispatch = useDispatch();
 
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token', error);
      return true;
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.token) {
      if (isTokenExpired(currentUser.token)) {
        dispatch(signoutSuccess());
      }
    }
    
    const interval = setInterval(() => {
      if (currentUser && currentUser.token && isTokenExpired(currentUser.token)) {
        dispatch(signoutSuccess());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentUser, dispatch]);

  if (!currentUser || (currentUser.token && isTokenExpired(currentUser.token))) {
    return <Navigate to="/auth/signin" />;
  }

  // Show mode selection if not chosen yet
  if (!appMode) {
    return <ModeSelectionModal />;
  }

  return <Outlet />;
};

export default PrivateRoute;