'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table,TableHead, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { addToCartAction, removeItemFormCart } from "@/lib/actions/cart.actions";
import { ChevronRight, Loader, Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CartList = ({ cart }: { cart?: Cart }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    return <div className="m-8 relative z-10">
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        {
            !cart || cart.cartItems.length === 0 ? (
                <div>
                    Cart is empty. <Link href='/'>Continue shopping</Link>
                </div>
            ) : (
                <div className='grid md:grid-cols-4 md:gap-5'>
                    <div className='overflow-x-auto md:col-span-3 mb-4'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className='hidden md:table-cell text-center'>Price</TableHead>
                                    <TableHead className='text-center'>Quantity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    cart.cartItems.map((item) => (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link href={`/product/${item.slug}`} className="flex md:items-center xs:items-start sm:flex-row xs:flex-row flex-col gap-2">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    >
                                                    </Image>
                                                    <div className="flex flex-col gap-2">
                                                        <span className="px-2 ">{ item.name }</span>
                                                        <p className="text-sm ml-2 lg:hidden md:hidden">${item.price}</p>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell className='hidden md:table-cell text-center'>${item.price}</TableCell>
                                            <TableCell className='flex-center gap-2'>
                                                <Button
                                                    disabled={isPending}
                                                    variant='outline'
                                                    type="button"
                                                    onClick={() => 
                                                        startTransition(async() => {
                                                            const res = await removeItemFormCart(item.productId);
                                                            if(!res.success) {
                                                                toast({
                                                                    variant: 'destructive',
                                                                    description: res.message,
                                                                })
                                                            }
                                                        })
                                                    }
                                                >
                                                    {
                                                        isPending ? (<Loader className="w-4 h-4 animate-spin" />) : (<Minus className="w-4 h-4" />)
                                                    }
                                                </Button>
                                                <span>{item.qty}</span>
                                                <Button
                                                    disabled={isPending}
                                                    variant='outline'
                                                    type='button'
                                                    onClick={() =>
                                                        startTransition(async () => {
                                                            const res = await addToCartAction(item);
                                                            if (!res.success) {
                                                            toast({
                                                                variant: 'destructive',
                                                                description: res.message,
                                                            });
                                                            }
                                                        })
                                                    }
                                                >
                                                    {
                                                        isPending ? (
                                                        <Loader className='w-4 h-4  animate-spin' />
                                                        ) : (
                                                        <Plus className='w-4 h-4' />
                                                        )
                                                    }
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <Card className="rounded-none">
                        <CardHeader className="text-lg">
                            Summary
                        </CardHeader>
                        <CardContent className="flex flex-col p-6 gap-4">
                            <div className="flex justify-between">
                                Subtotal ({ cart.cartItems.reduce((acc, val) => acc + val.qty, 0)}):
                                <span className="font-bold">{ formatCurrency(cart.subtotal) }</span>
                            </div>
                            <div className="flex justify-between">
                                Shipping:
                                <span className="font-bold">{ formatCurrency(cart.shippingPrice) }</span>
                            </div>
                            <div className="flex justify-between">
                                Tax:
                                <span className="font-bold">{ formatCurrency(cart.taxAmount) }</span>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                Total:
                                <span className="font-bold">{ formatCurrency(cart.grandTotal) }</span>
                            </div>
                            <Button
                                disabled={isPending}
                                className='w-full rounded-none'
                                onClick={() => startTransition(() => router.push('/shipping'))}
                            >
                            Go to Checkout
                            {
                                isPending ? (
                                    <Loader className='animate-spin w-4 h-4' />
                                ) : (
                                    <ChevronRight className='w-4 h-4' />
                                )
                            }
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )
        }
    </div>;
}
 
export default CartList;