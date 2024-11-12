import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Heart, ArrowDown } from 'lucide-react';
import image1 from '../Images/1.jpg';
import image2 from '../Images/2.jpg';
import image3 from '../Images/3.jpg';
import image4 from '../Images/5.jpg';
const backgroundImages = [
  image4, image2,image3 , image1
];


const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const imageRefs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Background image animation with GSAP
    gsap.fromTo(
      imageRefs.current[currentImage],
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
    );

    imageRefs.current.forEach((image, index) => {
      if (index !== currentImage) {
        gsap.to(image, { opacity: 0, x: -100, duration: 1, ease: 'power2.in' });
      }
    });
  }, [currentImage]);

  return (
    <div className="relative h-[700px] overflow-hidden w-full">
      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <div
          key={image}
          ref={(el) => (imageRefs.current[index] = el)}
          className="absolute inset-0 transition-transform"
          style={{
            backgroundImage: `url(${image}?auto=format&fit=crop&w=1920&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center">
              <img
                src={require('../Images/4.jpg')}
                alt="Logo"
                className="w-24 h-24 rounded-full border-4 border-orange-500"
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sanctified Food Carries The Blessings Of The Lord!
            </h1>

            <div className="flex justify-center items-center gap-2 mb-8">
              <Heart className="text-red-500" size={24} />
              <p className="text-xl text-orange-200">It is satvik food!</p>
            </div>

            <p className="text-lg md:text-xl text-gray-200 mb-12">
              Join us in our divine mission to serve blessed food to those in need. Every meal we serve carries the essence of love, care, and spiritual nourishment.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12 text-white">
              <div className="bg-orange-600/20 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-bold text-2xl mb-2">Daily Meals</h3>
                <p>Serving over 1000+ meals daily with love and devotion</p>
              </div>
              <div className="bg-orange-600/20 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-bold text-2xl mb-2">Pure Ingredients</h3>
                <p>Using the finest quality satvik ingredients</p>
              </div>
              <div className="bg-orange-600/20 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-bold text-2xl mb-2">Divine Service</h3>
                <p>Spreading joy through food and spiritual connection</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                Donate Now
                <Heart size={20} />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>

            <div className="animate-bounce flex justify-center">
              <ArrowDown className="text-white" size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
