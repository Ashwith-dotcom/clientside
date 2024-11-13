import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Initiative() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const listItemRefs = useRef([]);

  useEffect(() => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      });

      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      });

      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="initiative" ref={sectionRef} className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900"
        >
          Our First Initiative
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <div 
            ref={imageRef}
            className="overflow-hidden rounded-lg shadow-lg h-[300px] md:h-[400px]"
          >
            <img
              src={require("../Images/Hospital.avif")}
              alt="Government Hospital"
              className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-300"
            />
          </div>
          <div ref={contentRef} className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
            Starting our journey at Government Maternity Hospital (GMH SB),
            Sultan Bazar, Koti, Hyderabad
            </h3>
            <p className="text-gray-600">
              We've begun our journey with the transformation of a government hospital, 
              focusing on improving facilities, equipment, and patient care. This is just 
              the beginning - we have plans to extend our initiative to more hospitals 
              in the coming days.
            </p>
            
          </div>
        </div>
      </div>
    </section>
  );
}