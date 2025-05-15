import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Modalll = ({ 
  isOpen, 
  onRequestClose, 
  children,
  width = "400px", 
  height = "auto",
  className = "",
  overlayClassName = ""
}) => {

  const handleBackdropClick = () => {
    onRequestClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-11 z-50 ${overlayClassName}`}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`bg-white p-8 rounded-lg shadow-lg relative overflow-y-auto dark:bg-boxdark ${className}`}
            style={{
              width,
              height,
              position: 'absolute',
              right: '50px',
              top: '50px',
              transform: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute text-2xl top-0 right-0 m-3 text-gray-600 hover:text-gray-800 dark:text-red-600"
              onClick={handleBackdropClick}
            >
              &times;
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modalll;