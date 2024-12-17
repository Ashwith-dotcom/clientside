import React from 'react';
import { Toaster } from 'react-hot-toast';
import Hero from './components/Hero';
import DonationForm from './components/DonationForm';

import Impact from './components/Impact';

import Footer from './components/Footer';
import Initiative from './components/Initiative';
import WhatWeDo from './components/WhatWeDo';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <Hero />
      <section id="donate-section" className="py-20">
        <DonationForm />
      </section>
      <Initiative/>
      <Impact />
      <WhatWeDo/>
      <Footer />
    </div>
  );
}

export default App;