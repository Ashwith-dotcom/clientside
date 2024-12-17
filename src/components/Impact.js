import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Utensils, Building2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const impactData = [
  {
    icon: Users,
    number: "6,000+",
    text: "People Served Monthly",
  },
  {
    icon: Utensils,
    number: "6000+",
    text: "Meals Distributed",
  },
  {
    icon: Building2,
    number: "1",
    text: "Hospitals Covered",
  },
];

const Impact = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".impact-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="py-20 bg-orange-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-orange-600 mb-16">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {impactData.map((item, index) => (
            <div
              key={index}
              className="impact-item text-center bg-white rounded-xl shadow-lg p-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-orange-100 rounded-full">
                <item.icon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {item.number}
              </h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Impact;
