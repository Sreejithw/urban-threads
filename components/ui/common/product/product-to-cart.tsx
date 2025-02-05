'use client'

import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Cart, CartItem } from "@/types";
import { Button } from "../../button";
import { Loader, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { addToCartAction, removeItemFormCart } from "@/lib/actions/cart.actions";
import { ToastAction } from "../../toast";

const ProductToCart = ({ cart, item }: { cart?: Cart, item: CartItem}) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();
    const handleAddItem = async () => {
        startTransition(async () => {
            const res = await addToCartAction(item);
            if (!res.success) {
             toast({
               variant: 'destructive',
               description: res.message,
             });
             return;
           }
       
           toast({
             description: res.message,
             action: (
               <ToastAction
                 className='bg-primary text-black hover:bg-gray-800'
                 onClick={() => router.push('/cart')}
                 altText='Go to cart'
               >
                 Go to cart
               </ToastAction>
             ),
           });
        });
    };

    const handleRemoveItem = async() => {
        startTransition(async () => {
            const res = await removeItemFormCart(item.productId);
            toast({ 
                variant: res.success ? 'default' : 'destructive',
                description: res.message
            });
            return;
        });
    }

    const existingItem = cart && cart.cartItems.find((selectedItem) => selectedItem.productId === item.productId);

    return existingItem ? (
        <div>
            <Button type="button" variant="outline" disabled={isPending} onClick={handleRemoveItem}>
                {
                    isPending ? (
                        <Loader className='w-4 h-4 animate-spin' />
                    ) : (
                        <Minus className="w-4 h-4" />
                    )
                }
            </Button>
            <span className="px-2">{ existingItem.qty }</span>
            <Button type="button" variant="outline" disabled={isPending} onClick={handleAddItem}>
                {
                    isPending ? (
                        <Loader className='w-4 h-4  animate-spin' />
                    ): (
                        <Plus className="w-4 h-4" />
                    )
                }
            </Button>
        </div>
    ) :
    (
        <Button className='w-full' type='button' disabled={isPending} onClick={handleAddItem}>
            {
                isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Plus className='w-4 h-4' />
                )
            }
            Add to Cart
        </Button>
    )
}
 
export default ProductToCart;