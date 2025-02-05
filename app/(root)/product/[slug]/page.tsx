import PriceList from "@/components/ui/common/products/price-list";
import ProductImage from "@/components/ui/common/product/product-image";
import ProductToCart from "@/components/ui/common/product/product-to-cart";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getSelectedProduct } from "@/lib/actions/product.actions";
import { Card, CardContent } from "@/components/ui/card";
import { getMyCart } from "@/lib/actions/cart.actions";

const ProductDetailPage = async(props: {
    params: Promise<{ slug: string}>
}) => {
    const { slug } = await props.params;

    const product = await getSelectedProduct(slug);
    if(!product) notFound();

    const cart = await getMyCart();

    return  <>
        <section>
            <div className="grid grid-cols-1 md:grid-cols-5">
                <div className="col-span-2">
                    <ProductImage images={product.images} />
                </div>
                <div className="col-span-2 p-5">
                    <div className="flex flex-col gap-6">
                        <p>
                            {product.brand} {product.category}
                        </p>
                        <h1 className="h3-bold">{product.name}</h1>
                        <p>{product.rating} of {product.numReviews}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <PriceList value={Number(product.price)} className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"/>
                        </div>
                    </div>
                    <div className="mt-10">
                        <p className="font-semibold">Description</p>
                        <p>{product.description}</p>
                    </div>
                </div>
                <div>
                    <Card>
                        <CardContent className="p-4">
                            <div className="mb-2 flex justify-between">
                                <div>Price</div>
                                <div>
                                    <PriceList value={Number(product.price)}/>
                                </div>
                            </div>
                            <div className="mb-2 flex justify-between">
                                <div>Status</div>
                                { product.stock > 0 ? (
                                    <Badge variant="outline">In Stock</Badge>
                                ) : (
                                    <Badge variant="destructive">Out Of Stock</Badge>
                                )}
                            </div>
                            {
                                product.stock > 0 && (
                                    <div className="flex-center">
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
                                )
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    </>;
}
 
export default ProductDetailPage;