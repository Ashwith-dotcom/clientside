import React from 'react';
import { Toaster } from 'react-hot-toast';
import Hero from './components/Hero';
import DonationForm from './components/DonationForm';
import Impact from './components/Impact';
import HospitalGallery from './components/HospitalGallery';
import SwamijiGallery from './components/SwamijiGallery';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <Hero />
      <Impact />
      <SwamijiGallery />
      <HospitalGallery />
      
      <section id="donate-section" className="py-20">
        <DonationForm />
      </section>
      <Footer />
    </div>
  );
}

export default App;