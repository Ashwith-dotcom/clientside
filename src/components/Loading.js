import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import namasteAnimation from './namaste.json'

const Loading = ({ onLoadingComplete }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      if (onLoadingComplete) {
        setTimeout(onLoadingComplete, 500);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);


  return (
    <div className={`fixed inset-0 bg-orange-100 flex flex-col items-center justify-center transition-opacity duration-500 ${showContent ? 'opacity-0' : 'opacity-100'}`}>
      
      <div className="mb-8">
        <img 
          src="/Images/downloa.jpg" 
          alt="Organization Logo"
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-orange-500 object-cover"
        />
      </div>

      {/* Lottie Animation */}
      <div className="w-24 h-24 mb-6">
        <Lottie 
          animationData={namasteAnimation}
          loop={true}
          style={{ 
            filter: 'brightness(0) saturate(100%) invert(65%) sepia(19%) saturate(2405%) hue-rotate(346deg) brightness(101%) contrast(96%)'
          }}
        />
      </div>

      {/* Text */}
      <h1 className="text-2xl md:text-4xl font-bold text-orange-800 tracking-wider">
        JAI SRIMANNARAYANA!
      </h1>
    </div>
  );
};

export default Loading;