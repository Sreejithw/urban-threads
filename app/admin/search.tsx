'use client'

import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchAdmin = () => {
    const pathname = usePathname();
    const formActionUrl = pathname.includes('/admin/orders')
      ? '/admin/orders'
      : pathname.includes('/admin/users')
      ? '/admin/users'
      : '/admin/products';
  
    const searchParams = useSearchParams();
    const [queryValue, setQueryValue] = useState(searchParams.get('query') || '');

    return ( 
        <form action={formActionUrl} method='GET'>
            <Input
                type='search'
                placeholder='Search...'
                name='query'
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
                className='md:w-[100px] lg:w-[300px]'
            />
            <button type='submit' className='sr-only'>
            Search
            </button>
      </form>
    );
}
 
export default SearchAdmin;