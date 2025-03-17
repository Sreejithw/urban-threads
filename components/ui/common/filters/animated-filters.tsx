'use client';

import { pricesFilers } from "@/lib/constants/search.constants";
import Link from "next/link";

interface Category {
    category: string;
}

interface AnimatedFiltersProps {
    showFilters: string;
    categories: Category[];
    ratings: number[];
    getFilterUrl: (params: { c?: string; p?: string; r?: string; }) => string;
    category: string;
    price: string;
    rating: string;
}

const AnimatedFilters = ({ 
    showFilters, 
    categories, 
    ratings, 
    getFilterUrl, 
    category, 
    price, 
    rating 
}: AnimatedFiltersProps) => {
    return (
        <div className={`
            filter-links
            grid grid-rows-[0fr]
            ${showFilters === 'true' ? 'grid-rows-[1fr]' : ''}
            transition-[grid-template-rows] duration-300 ease-in-out
        `}>
            <div className="overflow-hidden">
                {/* Category Links */}
                <div className='text-xl mt-3 mb-2'>Department</div>
                <div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`${('all' === category || '' === category) && 'font-bold'}`}
                                href={getFilterUrl({ c: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {categories.map((x) => (
                            <li key={x.category}>
                                <Link
                                    className={`${x.category === category && 'font-bold'}`}
                                    href={getFilterUrl({ c: x.category })}
                                >
                                    {x.category}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className='text-xl mt-8 mb-2'>Price</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`${'all' === price && 'font-bold'}`}
                                href={getFilterUrl({ p: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {pricesFilers.map((p) => (
                            <li key={p.value}>
                                <Link
                                    href={getFilterUrl({ p: p.value })}
                                    className={`${p.value === price && 'font-bold'}`}
                                >
                                    {p.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className='text-xl mt-8 mb-2'>Customer Review</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                href={getFilterUrl({ r: 'all' })}
                                className={`${'all' === rating && 'font-bold'}`}
                            >
                                Any
                            </Link>
                        </li>
                        {ratings.map((r) => (
                            <li key={r}>
                                <Link
                                    href={getFilterUrl({ r: `${r}` })}
                                    className={`${r.toString() === rating && 'font-bold'}`}
                                >
                                    {`${r} stars & up`}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnimatedFilters; 