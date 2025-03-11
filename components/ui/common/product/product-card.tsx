import Link from "next/link";
import { Card, CardContent, CardHeader } from "../../card";
import Image from "next/image";
import PriceList from "../products/price-list";
import { Product } from "@/types";
import ReviewStars from "../review/review-stars";
import { Button } from "../../button";

const ProductCard = ( {product}: {product: Product} ) => {
    return (
        <Card className="w-full max-w-sm bg-[#1A1A1A] rounded-3xl overflow-hidden">
            <CardHeader className="p-0 items-center">
                <Image src={product.images[0]} alt={product.name} height={300} width={300} priority={true} className="w-full object-cover"/>
            </CardHeader>
            <CardContent className="p-6 grid gap-2">
                <div className="flex justify-between items-center">
                    <div className="text-xs">{product.brand}</div>
                    <ReviewStars value={Number(product.rating)} />
                </div>
                <Link href={`/product/${product.slug}`}>
                    <h2 className="text-xl font-semibold text-white">{ product.name }</h2>
                </Link>
                <p className="text-gray-400 text-sm">{product.brand}</p>
                <div className="flex justify-between items-center mt-2">
                    { product.stock > 0 ? ( 
                        <PriceList value={Number(product.price)} />
                    ) : (
                        <p className="text-destructive">Out Of Stock</p>
                    )}
                    <Link href={`/product/${product.slug}`}>
                        <Button className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm">
                            View Details
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
 
export default ProductCard;