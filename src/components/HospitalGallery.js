import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, Users, HeartPulse } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const hospitals = [
  {
    name: "Gandhi Hospital",
    patients: "5000+",
    staff: "1200+",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "NIMS Hospital",
    patients: "4500+",
    staff: "900+",
    image: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Osmania Hospital",
    patients: "6000+",
    staff: "1500+",
    image: "https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Area Hospital",
    patients: "3000+",
    staff: "600+",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
  }
];

const HospitalGallery = () => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Infinite scroll animation
      gsap.to(scrollerRef.current, {
        x: "-100%",
        ease: "none",
        duration: 20,
        repeat: -1
      });

      // Pause on hover
      scrollerRef.current?.addEventListener('mouseenter', () => {
        gsap.to(scrollerRef.current, { timeScale: 0 });
      });

      scrollerRef.current?.addEventListener('mouseleave', () => {
        gsap.to(scrollerRef.current, { timeScale: 1 });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-orange-50 py-16 overflow-hidden">
      <h2 className="text-3xl font-bold text-center text-orange-600 mb-12">Hospitals We Serve</h2>
      <div ref={containerRef} className="relative w-full overflow-hidden">
        <div ref={scrollerRef} className="flex gap-6 whitespace-nowrap">
          {[...hospitals, ...hospitals].map((hospital, index) => (
            <div
              key={index}
              className="w-80 flex-shrink-0 bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              <img
                src={hospital.image}
                alt={hospital.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{hospital.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="text-orange-500" />
                    <span>Patients Served: {hospital.patients}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-orange-500" />
                    <span>Staff Supported: {hospital.staff}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalGallery;