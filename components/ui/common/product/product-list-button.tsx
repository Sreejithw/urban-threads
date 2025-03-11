'use client';

import { useRouter } from "next/navigation";
import { Button } from "../../button";

const ProductListButton = () => {
    const router = useRouter();

  return (
    <div className='flex justify-center items-center my-8'>
      <Button
        onClick={() => router.push('/search')}
        className='bg-red-500 text-white px-8 py-4 text-lg font-semibold'
      >
        View All Products
      </Button>
    </div>
  );
}
 
export default ProductListButton;