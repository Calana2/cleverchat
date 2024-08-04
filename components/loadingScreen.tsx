import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="relative inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex space-x-2">
        <div className="w-4 h-4 rounded-full bg-gray-800 animate-pulse"></div>
        <div className="w-4 h-4 rounded-full bg-gray-800 animate-pulse"></div>
        <div className="w-4 h-4 rounded-full bg-gray-800 animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
