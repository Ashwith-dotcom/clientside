import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Heart, ArrowDown } from 'lucide-react';
import image1 from '../Images/1.jpg';
import image2 from '../Images/2.jpg';
import image3 from '../Images/3.jpg';
import image4 from '../Images/5.jpg';

const backgroundImages = [image4, image2, image3, image1];

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
    <div className="relative min-h-[500px] h-[calc(100vh-4rem)] lg:min-h-[800px] overflow-hidden w-full">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-4 sm:mb-8 flex justify-center">
              <img
                src={require('../Images/4.jpg')}
                alt="Logo"
                className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full border-4 border-orange-500 object-cover shadow-xl"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-orange-50 mb-3 sm:mb-6 leading-tight px-2 font-serif tracking-wide">
              Sanctified Food Becomes The Blessings Of The Lord!
            </h1>

            <div className="flex justify-center items-center gap-2 mb-3 sm:mb-6">
              <Heart className="text-red-400 w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
              <p className="text-base sm:text-xl lg:text-2xl text-orange-200 font-medium italic">
                It is satvik food!
              </p>
            </div>

            <p className="text-sm sm:text-lg lg:text-xl text-orange-100/90 mb-8 sm:mb-12 px-4 max-w-3xl mx-auto font-light leading-relaxed">
              Join us in our divine mission to serve sanctified food to those in need. Every meal we serve carries the essence of love, care, and spiritual nourishment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12 text-white px-4">
              <div className="bg-gradient-to-br from-orange-600/30 to-orange-500/20 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-orange-400/20 shadow-lg transform hover:scale-105 transition-all">
                <h3 className="font-bold text-base sm:text-xl lg:text-2xl mb-2 sm:mb-3 text-orange-100">Daily Meals</h3>
                <p className="text-xs sm:text-base text-orange-100/80">Serving over 200+ meals daily with love and devotion</p>
              </div>
              <div className="bg-gradient-to-br from-orange-600/30 to-orange-500/20 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-orange-400/20 shadow-lg transform hover:scale-105 transition-all">
                <h3 className="font-bold text-base sm:text-xl lg:text-2xl mb-2 sm:mb-3 text-orange-100">Pure Ingredients</h3>
                <p className="text-xs sm:text-base text-orange-100/80">Using the finest quality satvik ingredients</p>
              </div>
              <div className="bg-gradient-to-br from-orange-600/30 to-orange-500/20 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-orange-400/20 shadow-lg transform hover:scale-105 transition-all">
                <h3 className="font-bold text-base sm:text-xl lg:text-2xl mb-2 sm:mb-3 text-orange-100">Divine Service</h3>
                <p className="text-xs sm:text-base text-orange-100/80">Spreading joy through food and spiritual connection</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-lg font-medium group"
              >
                Donate Now
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button className="border-2 border-orange-200/30 text-orange-100 px-8 sm:px-10 py-3 sm:py-4 rounded-lg hover:bg-orange-200/10 transition-all shadow-lg text-sm sm:text-lg font-medium backdrop-blur-sm">
                Learn More
              </button>
            </div>

            <div className="animate-bounce flex justify-center">
              <ArrowDown className="text-orange-200 w-5 h-5 sm:w-8 sm:h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

// import React, { useState, useEffect, useRef } from 'react';
// import { gsap } from 'gsap';
// import { Heart, ArrowDown } from 'lucide-react';
// import { Container } from './common/Container';

// const Hero = () => {
//   const [currentImage, setCurrentImage] = useState(0);
//   const imageRefs = useRef([]);
//   const contentRef = useRef(null);
//   const backgroundImages = [
//     require('../Images/5.jpg'),
//     require('../Images/2.jpg'),
//     require('../Images/3.jpg'),
//     require('../Images/1.jpg')
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     gsap.fromTo(
//       imageRefs.current[currentImage],
//       { opacity: 0, scale: 1.1 },
//       { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }
//     );

//     gsap.fromTo(
//       contentRef.current,
//       { opacity: 0, y: 30 },
//       { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
//     );
//   }, [currentImage]);

//   return (
//     <div className="relative min-h-[90vh] overflow-hidden">
//       {/* Background Images */}
//       {backgroundImages.map((image, index) => (
//         <div
//           key={index}
//           ref={(el) => (imageRefs.current[index] = el)}
//           className="absolute inset-0 transition-transform duration-1000"
//           style={{
//             backgroundImage: `url(${image})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             opacity: index === currentImage ? 1 : 0
//           }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-[1px]" />
//         </div>
//       ))}

//       {/* Content */}
//       <Container className="relative h-full z-10">
//         <div className="h-full flex items-center" ref={contentRef}>
//           <div className="max-w-5xl mx-auto text-center">
//             {/* Logo */}
//             <div className="mb-8 inline-block">
//               <img
//                 src={require('../Images/4.jpg')}
//                 alt="Logo"
//                 className="w-32 h-32 rounded-full border-4 border-orange-500 object-cover shadow-2xl
//                          ring-4 ring-orange-300/20 transform hover:scale-105 transition-all duration-300"
//               />
//             </div>

//             {/* Title */}
//             <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
//               <span className="gradient-text">Sanctified Food</span>
//               <br />
//               <span className="text-white">Becomes The Blessings Of The Lord!</span>
//             </h1>

//             {/* Subtitle */}
//             <div className="flex justify-center items-center gap-3 mb-8">
//               <Heart className="text-orange-400 w-8 h-8 animate-pulse" />
//               <p className="text-2xl md:text-3xl text-orange-200 font-display italic">
//                 It is satvik food!
//               </p>
//             </div>

//             {/* Description */}
//             <p className="text-xl md:text-2xl text-orange-100/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
//               Join us in our divine mission to serve sanctified food to those in need. 
//               Every meal we serve carries the essence of love, care, and spiritual nourishment.
//             </p>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//               {[
//                 { title: "Daily Meals", desc: "Serving over 200+ meals daily with love and devotion" },
//                 { title: "Pure Ingredients", desc: "Using the finest quality satvik ingredients" },
//                 { title: "Divine Service", desc: "Spreading joy through food and spiritual connection" }
//               ].map((stat, index) => (
//                 <div key={index} className="group bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20
//                                         transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
//                   <h3 className="text-2xl font-display font-bold mb-3 text-orange-300 group-hover:text-orange-200">
//                     {stat.title}
//                   </h3>
//                   <p className="text-orange-100/80 group-hover:text-white">
//                     {stat.desc}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
//               <button className="button-primary group">
//                 Donate Now
//                 <Heart className="inline-block ml-2 group-hover:scale-125 transition-transform" />
//               </button>
//               <button className="button-secondary">
//                 Learn More
//               </button>
//             </div>

//             {/* Scroll Indicator */}
//             <div className="animate-bounce">
//               <ArrowDown className="text-orange-200 w-8 h-8 mx-auto" />
//             </div>
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default Hero;
