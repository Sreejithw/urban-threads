'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate navbar on load
    gsap.from(navRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Animate menu items
    const menuItems = menuRef.current?.querySelectorAll('a');
    if (menuItems) {
      gsap.from(menuItems, {
        opacity: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.5,
        ease: 'power2.out'
      });
    }
  }, []);

  return (
    <nav 
      ref={navRef} 
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-black bg-opacity-90"
    >
      <div className="text-white text-2xl font-bold">
        <Link href="/">MOMENTUM</Link>
      </div>
      
      <div ref={menuRef} className="hidden md:flex space-x-8">
        <Link href="#collection" className="text-white hover:text-[#c5ff00] transition-colors">
          Collection
        </Link>
        <Link href="#product" className="text-white hover:text-[#c5ff00] transition-colors">
          Product
        </Link>
        <Link href="#brand" className="text-white hover:text-[#c5ff00] transition-colors">
          Brand
        </Link>
        <Link href="#community" className="text-white hover:text-[#c5ff00] transition-colors">
          Community
        </Link>
      </div>
      
      <div className="md:hidden">
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 