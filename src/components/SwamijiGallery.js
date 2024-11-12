import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import image1 from '../Images/1.jpg';
import image2 from '../Images/2.jpg';
import image3 from '../Images/3.jpg';
import image4 from '../Images/5.jpg';
gsap.registerPlugin(ScrollTrigger);

const swamijiImages = [
  {
    url: image1,
    caption: "Blessing the food preparation"
  },
  {
    url: image2,
    caption: "Meeting with hospital staff"
  },
  {
    url: image3,
    caption: "Food distribution ceremony"
  },
  {
    url: image4,
    caption: "Visiting patients"
  }
];

const SwamijiGallery = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered fade in animation
      gsap.from('.swamiji-image', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: {
          amount: 1.5,
          from: "random"
        }
      });

      // Floating animation
      gsap.to('.swamiji-image', {
        y: '10px',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: {
          amount: 1,
          from: "random"
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-12">
          Swamiji's Hospital Visits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {swamijiImages.map((image, index) => (
            <div
              key={index}
              className="swamiji-image relative group overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-64 object-cover transform transition-transform group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-center">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwamijiGallery;