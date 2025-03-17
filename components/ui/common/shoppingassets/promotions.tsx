'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '../../button';
import { countDownTimer } from '@/lib/utils';

// Static target date (replace with desired date)
const TARGET_DATE = new Date('2025-05-20T00:00:00');

const Promotions = () => {
  const [time, setTime] = useState<ReturnType<typeof countDownTimer>>();

  useEffect(() => {
    // Calculate initial time remaining on the client
    setTime(countDownTimer(TARGET_DATE));

    const timerInterval = setInterval(() => {
      const newTime = countDownTimer(TARGET_DATE);
      setTime(newTime);

      // Clear when countdown is over
      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Render a loading state during hydration
  if (!time) {
    return (
      <section className='grid grid-cols-1 md:grid-cols-2 my-20'>
        <div className='flex flex-col gap-2 justify-center'>
          <h3 className='text-3xl font-bold'>Loading Countdown...</h3>
        </div>
      </section>
    );
  }

  // If the countdown is over, display fallback UI
  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return (
      <section className='grid grid-cols-1 md:grid-cols-2 my-20'>
        <div className='flex flex-col gap-2 justify-center'>
          <h3 className='text-3xl font-bold'>Deal Has Ended</h3>
          <p>
            This deal is no longer available. Check out our latest promotions!
          </p>
          <div className='text-center'>
            <Button asChild>
              <Link href='/search'>View Products</Link>
            </Button>
          </div>
        </div>
        <div className='flex justify-center'>
          <Image
            src='/images/promo.png'
            alt='promotion'
            width={300}
            height={200}
          />
        </div>
      </section>
    );
  }

  return (
    <section className='grid grid-cols-1 md:grid-cols-2'>
      <div className='flex flex-col gap-6 justify-center w-full bg-gradient-to-b from-teal-400 to-teal-600 text-white pt-16 pb-4 relative'>
        {/* Border container */}
        <div className='absolute inset-8 border-2 border-white'></div>
        
        <div className='grid grid-cols-4 gap-4 border-b border-white/20 pb-6 w-[75%] self-center'>
          <StatBox label='DAYS' value={time.days} />
          <StatBox label='HOURS' value={time.hours} />
          <StatBox label='MINUTES' value={time.minutes} />
          <StatBox label='SECONDS' value={time.seconds} />
        </div>
        
        <div className='text-center space-y-4'>
          <h3 className='text-4xl sm:text-4xl xs:text-3xl font-bold tracking-widest'>WEEKEND</h3>
          <div className='space-y-2'>
            <p className='text-5xl sm:text-4xl xs:text-4xl font-bold tracking-[0.3em] text-outline'>FLASH</p>
            <p className='text-5xl sm:text-4xl xs:text-4xl font-bold tracking-[0.3em] text-outline'>SALE</p>
          </div>
          <p className='text-lg sm:text-base xs:text-sm'>ENDS {TARGET_DATE.toLocaleDateString()}</p>
          <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md relative z-10" asChild>
            <Link href='/search'>Shop Now</Link>
          </Button>
        </div>
      </div>
      <div className='relative w-full'>
        <Image
          src='/images/promo.png' 
          alt='promotion'
          fill
          className='object-cover'
          priority
        />
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div className='text-center'>
    <p className='text-2xl md:text-4xl font-bold'>{value.toString().padStart(2, '0')}</p>
    <p className='text-[0.5rem] xs:text-[0.5rem] sm:text-xs md:text-sm tracking-wider'>{label}</p>
  </div>
);

export default Promotions;
