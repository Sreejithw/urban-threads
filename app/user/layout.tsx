import ProfileSection from '@/components/ui/common/header/profile/profile';
import { COMPANY_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from './navbar';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className='flex flex-col'>
        <div className='border-b container mx-auto'>
          <div className='flex h-16 items-center px-4'>
            <Link href='/' className='w-22'>
              <Image
                src='/images/uTLogo.png'
                width={40}
                height={40}
                alt={`${COMPANY_NAME} logo`}
              />
            </Link>
            <NavBar className='mx-6' />
            <div className='ml-auto flex items-center space-x-4'>
              <ProfileSection />
            </div>
          </div>
        </div>
        <div className='flex-1 space-y-4 p-8 pt-6 container mx-auto'>
          {children}
        </div>
      </div>
    </>
  );
}