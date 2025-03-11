import Checkout from "@/components/ui/common/checkout/checkout";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUserByIdAction } from "@/lib/actions/auth.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import PurchaseOrderForm from "./purchase-form";


export const metadata: Metadata = {
    title: "Purchase Order",
}

const PurchaseOrderPage = async () => {
    const cart = await getMyCart();
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
    throw new Error('User ID not found');
    }
    
    const user = await getUserByIdAction(userId);

    if (!cart || cart.cartItems.length === 0) redirect('/cart');
    if (!user?.address) redirect('/shipping');
    if (!user?.paymentType) redirect('/payments');

    const userAddress = user.address as ShippingAddress;

    return (
        <>
            <Checkout current={3} />
    
            <h1 className='py-4 pl-[10rem] text-2xl'>Place Order</h1> 
            <div className='grid md:grid-cols-3 md:gap-5 pr-[10rem] pl-[10rem] pb-[5rem]'>
                <div className='overflow-x-auto md:col-span-2 space-y-4'>
                    <Card>
                        <CardContent className='p-4 gap-4'>
                            <h2 className='text-xl pb-4'>Shipping Address</h2>
                            <p>{userAddress.fullName}</p>
                            <p>
                                {userAddress.streetAddress}, {userAddress.city}, {userAddress.postalCode},{' '}
                                {userAddress.country}{' '}
                            </p>
                            <div className='mt-3'>
                            <Link href='/shipping'>
                                <Button variant='outline'>Edit</Button>
                            </Link>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className='p-4 gap-4'>
                            <h2 className='text-xl pb-4'>Payment Method</h2>
                            <p>{user.paymentType}</p>
                            <div className='mt-3'>
                                <Link href='/payment-method'>
                                    <Button variant='outline'>Edit</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className='p-4 gap-4'>
                            <h2 className='text-xl pb-4'>Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cart.cartItems.map((item) => (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                            <Link
                                                href={`/product/${item.slug}`}
                                                className='flex items-center'
                                            >
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={50}
                                                    height={50}
                                                ></Image>
                                                <span className='px-2'>{item.name}</span>
                                            </Link>
                                            </TableCell>
                                            <TableCell>
                                            <span className='px-2'>{item.qty}</span>
                                            </TableCell>
                                            <TableCell className='text-right'>${item.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Link href='/cart'>
                                <Button variant='outline'>Edit</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className='p-4 gap-4 space-y-4'>
                            <div className='flex justify-between'>
                                <div>Items</div>
                                <div>{formatCurrency(cart.subtotal)}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>Tax</div>
                                <div>{formatCurrency(cart.taxAmount)}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>Shipping</div>
                                <div>{formatCurrency(cart.shippingPrice)}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>Total</div>
                                <div>{formatCurrency(cart.grandTotal)}</div>
                            </div>
                            <PurchaseOrderForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
 
export default PurchaseOrderPage;