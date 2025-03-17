'use client';

import { Product } from "@/types";
import ProductCard from "../product/product-card";
import { useRef } from 'react';

const ProductList = ({ data, title, maxShowValue} : { data: Product[], title?: string, maxShowValue?: number }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    
    const displayData = maxShowValue ? data.slice(0, maxShowValue) : data;

    return (

        <section 
            id="collection"
            ref={sectionRef} 
            className="min-h-10 py-24 px-6 md:px-16"
        >
            <h2 ref={titleRef} className="text-white text-4xl md:text-6xl font-bold mb-10 text-center">{title}</h2>
            { displayData.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                    { displayData.map((product: Product) => (
                        <ProductCard key={product.slug} product={product}/>
                    ))}
                </div>
            ) : (
                <div>
                    <p>No Products found</p>
                </div>
            ) }
        </section>
    );
}
 
export default ProductList;