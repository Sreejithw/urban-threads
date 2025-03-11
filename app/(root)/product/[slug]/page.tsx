import ProductReview from "./product-review";
import PriceList from "@/components/ui/common/products/price-list";
import ProductImage from "@/components/ui/common/product/product-image";
import ProductToCart from "@/components/ui/common/product/product-to-cart";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getSelectedProduct } from "@/lib/actions/product.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import { auth } from "@/auth";

const ProductDetailPage = async(props: {
    params: Promise<{ slug: string}>
}) => {
    const { slug } = await props.params;
    const session = await auth();
    const userId = session?.user?.id;

    const product = await getSelectedProduct(slug);
    if(!product) notFound();

    const cart = await getMyCart();

    return  <>
        <section className="pt-[6rem] pr-[20rem] pb-[10rem] pl-[20rem]">
            <div className="grid grid-cols-1 md:grid-cols-5 justify-items-center">
                <div className="col-span-2">
                    <ProductImage images={product.images} />
                </div>
                <div className="col-span-2 p-5">
                    <div className="flex flex-col gap-4">
                        <div className="text-sm uppercase tracking-wider text-gray-500">
                            {product.brand}
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                                <PriceList value={Number(product.price)} className="text-3xl font-bold"/>
                                { product.stock > 0 ? (
                                    <Badge variant="outline">In Stock</Badge>
                                ) : (
                                    <Badge variant="destructive">Out Of Stock</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                {product.stock > 0 && (
                                    <div className="rounded-md">
                                        <ProductToCart 
                                            cart={cart}
                                            item={{
                                                productId: product.id,
                                                name: product.name,
                                                slug: product.slug,
                                                price: product.price,
                                                qty: 1,
                                                image: product.images[0]
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className='mb-10 pr-[20rem] pl-[20rem]'>
            <h2 className='h2-bold  mb-5'>Customer Reviews</h2>
            <ProductReview
                productId={product.id}
                productSlug={product.slug}
                userId={userId || ''}
            />
        </section>
    </>;
}
 
export default ProductDetailPage;