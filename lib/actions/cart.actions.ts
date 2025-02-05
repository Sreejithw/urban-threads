'use server'

import { CartItem } from '@/types';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { getErrorMessage, convertToJSON, roundOffValue } from '../utils';
import { cartSchema, productCartSchema } from '../product-list-manager';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';


const calculateCartPrice = (items: CartItem[]) => {
    const totalPriceInCart = items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    const subtotal = roundOffValue(totalPriceInCart),
    taxAmount = roundOffValue(0.15 * subtotal),
    shippingPrice = roundOffValue(subtotal > 100 ? 0 : 10),
    grandTotal = roundOffValue(subtotal + shippingPrice + taxAmount);

    return {
        subtotal: subtotal.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
    };
};

export async function addToCartAction(data: CartItem) {
    try {
        const cartSessionId = (await cookies()).get('cartSessionId')?.value;
        if (!cartSessionId) throw new Error('Cart Session not found');

        const session = await auth();
        const userId =  session?.user?.id ? (session.user.id as string) : undefined;

        const cart = await getMyCart();

        const item = productCartSchema.parse(data);

        const product = await prisma.product.findFirst({
          where: { id: item.productId },
        });

        if (!product) throw new Error('Product not found');
    
        if(!cart){
            const newCart = cartSchema.parse({
                userId: userId,
                cartItems: [item],
                cartSessionId: cartSessionId,
                ...calculateCartPrice([item])
            });
            
            await prisma.cart.create({ data: newCart });

            revalidatePath(`/product/${product.slug}`);
            
            return {
              success: true,
              message: `${product.name} has been added to your cart`,
            };
        } else {
            const itemInCart = (cart.cartItems as CartItem[]).find(
                (selectedItem) => selectedItem.productId === item.productId
            )

            if(itemInCart){
                if(product.stock < itemInCart.qty){
                    throw new Error('Product is out of stock');
                }

                itemInCart!.qty = itemInCart.qty + 1;
            } else {
                if (product.stock < 1) throw new Error('Not enough stock for this item');
                cart.cartItems.push(item);
            }

            await prisma.cart.update({
                where: { id: cart.id},
                data: {
                    cartItems: cart.cartItems as Prisma.CartUpdatecartItemsInput[],
                    ...calculateCartPrice(cart.cartItems as CartItem[])
                }
            });

            revalidatePath(`/product/${product.slug}`);
            return {
                success: true,
                message: `${product.name} ${
                    itemInCart ? 'has been updated in' : 'has been added to'
                } cart`,
              };
        }
    
      } catch (error) {
        console.log(error);
        return { success: false, message: getErrorMessage(error) };
      }
}


export async function getMyCart() {
    // Check for session cart cookie
    const cartSessionId = (await cookies()).get('cartSessionId')?.value;
    if (!cartSessionId) return undefined;
  
    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
  
    // Get user cart from database
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { cartSessionId: cartSessionId },
    });
  
    if (!cart) return undefined;
  
    // Convert Decimal values to strings
    return convertToJSON({
        ...cart,
        cartItems: cart.cartItems as CartItem[],
        subtotal: cart.subtotal.toString(),
        grandTotal: cart.grandTotal.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxAmount: cart.taxAmount.toString(),
    });
}

export async function removeItemFormCart(productId: string){
    try {
        const cartSessionId = (await cookies()).get('cartSessionId')?.value;
        if (!cartSessionId) throw new Error('No cart session id found');

        const product = await prisma.product.findFirst({
            where: { id: productId },
        });

        if(!product) throw new Error('Product not found');

        const cart = await getMyCart();
        if (!cart) throw new Error('Cart not found');

        const itemInCart = (cart.cartItems as CartItem[]).find((selectedItem) => selectedItem.productId === productId);
        if (!itemInCart) throw new Error('Item not found');

        if (itemInCart.qty === 1) {
            cart.cartItems = (cart.cartItems as CartItem[]).filter(
              (selectedItem) => selectedItem.productId !== itemInCart.productId
            );
        } else {
            (cart.cartItems as CartItem[]).find((selectedItem) => selectedItem.productId === productId)!.qty =
            itemInCart.qty - 1;
        }

        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                cartItems: cart.cartItems as Prisma.CartUpdatecartItemsInput[],
              ...calculateCartPrice(cart.cartItems as CartItem[]),
            },
        });

        revalidatePath(`/product/${product.slug}`);
        return {
            success: true,
            message: `${product.name}  ${
              (cart.cartItems as CartItem[]).find((selectedItem) => selectedItem.productId === productId)
                ? 'updated in'
                : 'removed from'
            } cart successfully`,
        };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}