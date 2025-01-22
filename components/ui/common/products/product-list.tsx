import { Product } from "@/types";
import ProductCard from "../product/product-card";

const ProductList = ({ data, title, maxShowValue} : { data: Product[], title?: string, maxShowValue?: number }) => {
    const displayData = maxShowValue ? data.slice(0, maxShowValue) : data;

    return (
        <div className="my-10">
            <h2 className="h2-bold mb-4">{title}</h2>
            { displayData.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    { displayData.map((product: Product) => (
                        <ProductCard key={product.slug} product={product}/>
                    ))}
                </div>
            ) : (
                <div>
                    <p>No Products found</p>
                </div>
            ) }
        </div>
    );
}
 
export default ProductList;