'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LoadingAnimation = () => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Hide the loader after animation completes
        document.body.style.overflow = 'visible';
      }
    });

    // Initial animation
    tl.to(progressRef.current, {
      width: '100%',
      duration: 1.5,
      ease: 'power2.inOut'
    })
    .to(textRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in'
    }, '-=0.3')
    .to(loaderRef.current, {
      y: '-100%',
      duration: 0.8,
      ease: 'power3.inOut'
    });

    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  return (
    <div 
      ref={loaderRef} 
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
    >
      <div ref={textRef} className="mb-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
          Urban Threads<span className="text-[#c5ff00]">X</span>
        </h1>
        <p className="text-zinc-400">Redefining Fashion</p>
      </div>
      
      <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          ref={progressRef} 
          className="h-full bg-[#c5ff00] w-0"
        ></div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 