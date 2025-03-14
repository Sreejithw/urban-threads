'use client'

import { PaginationProps } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../../button";
import { formQueryParamsforUrl } from "@/lib/utils";


const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onClick = (btnType: string) => {
        const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;

        const newUrl = formQueryParamsforUrl({
            params: searchParams.toString(),
            key: urlParamName || 'page',
            value: pageValue.toString(),
        });

        router.push(newUrl, { scroll: false });
    };
  
    return (
        <>
            <div className="flex gap-2">
                <Button
                    size='lg'
                    variant='outline'
                    className='w-28'
                    onClick={() => onClick('prev')}
                    disabled={Number(page) <= 1}
                >
                    Previous
                </Button>
                <Button
                    size='lg'
                    variant='outline'
                    className='w-28'
                    onClick={() => onClick('next')}
                    disabled={Number(page) >= totalPages}
                >
                    Next
                </Button>
            </div>
        </>
     );
}
 
export default Pagination;