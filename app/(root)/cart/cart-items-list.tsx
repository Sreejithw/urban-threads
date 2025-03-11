'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table,TableHead, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { addToCartAction, removeItemFormCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const CartList = ({ cart }: { cart?: Cart }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    return <div className="pt-10 pr-[10rem] pl-[10rem]">
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        {
            !cart || cart.cartItems.length === 0 ? (
                <div>
                    Cart is empty. <Link href='/'>Continue shopping</Link>
                </div>
            ) : (
                <div className='grid md:grid-cols-4 md:gap-5'>
                    <div className='overflow-x-auto md:col-span-3'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className='text-center'>Quantity</TableHead>
                                    <TableHead className='text-right'>Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    cart.cartItems.map((item) => (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link href={`/product/${item.slug}`} className="flex items-center">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    >
                                                    </Image>
                                                    <span className="px-2">{ item.name }</span>
                                                </Link>
                                            </TableCell>
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
                                            <TableCell className='text-right'>${item.price}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <div className="pb-3 text-xl">
                                Subtotal ({ cart.cartItems.reduce((acc, val) => acc + val.qty, 0)}):
                                <span className="font-bold">{ formatCurrency(cart.subtotal) }</span>
                            </div>
                            <Button
                                disabled={isPending}
                                className='w-full'
                                onClick={() => startTransition(() => router.push('/shipping'))}
                            >
                            {
                                isPending ? (
                                    <Loader className='animate-spin w-4 h-4' />
                                ) : (
                                    <ArrowRight className='w-4 h-4' />
                                )
                            }
                            Proceed to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )
        }
    </div>;
}
 
export default CartList;