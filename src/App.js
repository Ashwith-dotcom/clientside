import React,{useState} from 'react';
import { Toaster } from 'react-hot-toast';
import Hero from './components/Hero';
import DonationForm from './components/DonationForm';

import Impact from './components/Impact';
import Loading from './components/Loading';

import Footer from './components/Footer';
import Initiative from './components/Initiative';
import WhatWeDo from './components/WhatWeDo';
import AutopayManagement from './components/AutopayManagement';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const backgroundImage = '/Images/back1.jpg';

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };
  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Orange overlay */}
      <div className="absolute inset-0 bg-orange-100/80"></div>
      
      {/* Content container */}
      <div className="relative">
        {isLoading && <Loading onLoadingComplete={handleLoadingComplete} />}
        <div className={isLoading ? 'hidden' : ''}>
          <Toaster position="top-center" />
          <Hero />
          <DonationForm />
          <AutopayManagement/>
          <Initiative />
          <Impact />
          <WhatWeDo />
          <Footer />
        </div>
      </div>
    </div>
    // <div className="min-h-screen bg-orange-200">
    //   {isLoading && <Loading onLoadingComplete={handleLoadingComplete} />}
    //   <div className={isLoading ? 'hidden' : ''}>
    //     <Toaster position="top-center" />
    //     <Hero />
    //     <DonationForm />
    //     <Initiative />
    //     <Impact />
    //     <WhatWeDo />
    //     <Footer />
    //   </div>
    // </div>
  );
}

export default App;