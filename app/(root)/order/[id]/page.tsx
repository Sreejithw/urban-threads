import OrderDetailsList from "./order-details-list";
import Stripe from 'stripe';
import { getOrderByIdAction } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";
import { auth } from '@/auth';


export const metadata: Metadata = {
    title: 'Purchased Items',
};

const OrderItemsPage = async ( props: { params: Promise<{ id: string }>} ) => {
    const session = await auth();

    const { id } = await props.params;
    const order = await getOrderByIdAction(id);
    if (!order) notFound();
    
    
    let client_secret = null;
    // Check if using Stripe and not paid
    if (order?.paymentType === 'Stripe' && !order.isPaid) {
        // Initialize Stripe instance
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
        // Create a new payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(order.grandTotal) * 100),
            currency: 'USD',
            metadata: { orderId: order.id },
        });
        client_secret = paymentIntent.client_secret;
    }


    return (
        <OrderDetailsList 
            order={{
                ...order,
                shippingAddress: order.shippingAddress as ShippingAddress,
            }}
            stripeClientSecretKey={client_secret}
            paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
            isAdmin={session?.user?.role === 'admin' || false}
        />
    );
}
 
export default OrderItemsPage;