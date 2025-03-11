'use client';

import Image from 'next/image';
import gsap from 'gsap';
import bgImage from '@/assets/images/bgImage.jpg';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={heroRef} className="relative min-h-screen bg-black overflow-hidden">
      {/* Background image with overlay */}
      <div ref={imageRef} className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Person in orange hoodie walking on crosswalk with orange buildings"
          fill
          style={{ objectFit: 'cover', objectPosition: 'bottom', zIndex: 1 }}
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center items-center pt-32 px-6 md:items-start md:pl-16 lg:pl-24">
        <h1 ref={titleRef} className="text-white text-7xl md:text-9xl font-bold tracking-tighter">
          Urban<span className="text-[#c5ff00]">Threads</span>
          <span ref={yearRef} className="text-[#c5ff00] text-3xl md:text-4xl align-top ml-2">©2025</span>
        </h1>
        
        <div ref={taglineRef} className="mt-auto pt-64 md:pt-72">
          <h2 className="text-[#c5ff00] text-5xl md:text-7xl font-bold leading-tight tracking-tight max-w-xl">
            ALWAYS<br />
            ON YOUR<br />
            JOURNEY.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Hero; 