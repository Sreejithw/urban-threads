'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDateTime, maskDynamicId } from "@/lib/utils";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer} from '@paypal/react-paypal-js';
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { approvePayPalOrderAction, createPayPalOrderAction, deliverOrderAction, updateOrderPayStatusAction } from "@/lib/actions/order.actions";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import StripePayment from "./stripe-payment";

const OrderDetailsList = ({ order, paypalClientId, stripeClientSecretKey, isAdmin }: { order: Omit<Order, 'paymentResult'>, paypalClientId: string, stripeClientSecretKey: string | null, isAdmin: boolean }) => {
    const { toast } = useToast();
    const {
        shippingAddress,
        orderitems,
        subtotal,
        taxAmount,
        shippingPrice,
        grandTotal,
        paymentType,
        isPaid,
        paidAt,
        isDelivered,
        timeOfDelivery,
    } = order;

    function PrintLoadingState() {
        const [{ isPending, isRejected }] = usePayPalScriptReducer();
        let status = '';
        if (isPending) {
            status = 'Loading PayPal...';
        } else if (isRejected) {
            status = 'Error in loading PayPal.';
        }
        return status;
    }

    const handleCreatePayPalOrder = async () => {
        const res = await createPayPalOrderAction(order.id);
        if (!res.success)
          return toast({
            description: res.message,
            variant: 'destructive',
          });
        return res.data;
    };

    const handleApprovePayPalOrder = async (data: { orderID: string }) => {
        const res = await approvePayPalOrderAction(order.id, data);
        toast({
          description: res.message,
          variant: res.success ? 'default' : 'destructive',
        });
    };

    const MarkAsPaidButton = () => {
        const [isPending, startTransition] = useTransition();
        const { toast } = useToast();
        return (
          <Button
            type='button'
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const res = await updateOrderPayStatusAction(order.id);
                toast({
                  variant: res.success ? 'default' : 'destructive',
                  description: res.message,
                });
              })
            }
          >
            {isPending ? 'processing...' : 'Mark As Paid'}
          </Button>
        );
    };

    const MarkAsDeliveredButton = () => {
        const [isPending, startTransition] = useTransition();
        const { toast } = useToast();
        return (
          <Button
            type='button'
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const res = await deliverOrderAction(order.id);
                toast({
                  variant: res.success ? 'default' : 'destructive',
                  description: res.message,
                });
              })
            }
          >
            {isPending ? 'processing...' : 'Mark As Delivered'}
          </Button>
        );
    };
    
    return (
        <>
            <h1 className='py-4 pl-[10rem] text-2xl'> Order {maskDynamicId(order.id)}</h1>
            <div className='grid md:grid-cols-3 md:gap-5 pr-[10rem] pl-[10rem] pb-[5rem]'>
                <div className='overflow-x-auto md:col-span-2 space-y-4'>
                <Card>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'>Payment Method</h2>
                        <p>{paymentType}</p>
                        {isPaid ? (
                        <Badge variant='secondary'>
                            Paid at {formatDateTime(paidAt!).dateTime}
                        </Badge>
                        ) : (
                        <Badge variant='destructive'>Not paid</Badge>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'>Shipping Address</h2>
                        <p>{shippingAddress.fullName}</p>
                        <p>
                        {shippingAddress.streetAddress}, {shippingAddress.city},{' '}
                        {shippingAddress.postalCode}, {shippingAddress.country}{' '}
                        </p>
                        {isDelivered ? (
                        <Badge variant='secondary'>
                            Delivered at {formatDateTime(timeOfDelivery!).dateTime}
                        </Badge>
                        ) : (
                        <Badge variant='destructive'>Not delivered</Badge>
                        )}
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
                                {orderitems.map((item) => (
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
                    </CardContent>
                </Card>
                </div>
                <div>
                <Card>
                    <CardContent className='p-4 space-y-4 gap-4'>
                    <h2 className='text-xl pb-4'>Order Summary</h2>
                    <div className='flex justify-between'>
                        <div>Items</div>
                        <div>{formatCurrency(subtotal)}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div>Tax</div>
                        <div>{formatCurrency(taxAmount)}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div>Shipping</div>
                        <div>{formatCurrency(shippingPrice)}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div>Total</div>
                        <div>{formatCurrency(grandTotal)}</div>
                    </div>
                    {
                        !isPaid && paymentType === 'PayPal' && (
                            <div>
                                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                                    <PrintLoadingState />
                                    <PayPalButtons
                                    createOrder={handleCreatePayPalOrder}
                                    onApprove={handleApprovePayPalOrder}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        )
                    }
                    {
                        !isPaid && paymentType === 'Stripe' && stripeClientSecretKey && (
                            <StripePayment
                              priceInCents={Number(order.grandTotal) * 100}
                              orderId={order.id}
                              clientSecret={stripeClientSecretKey}
                            />
                        )
                    }
                    {
                        isAdmin && !isPaid && paymentType === 'COD' && (
                            <MarkAsPaidButton />
                        )
                    }
                    {
                        isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />
                    }
                    </CardContent>
                </Card>
                </div>
            </div>
        </>
    );
}
 
export default OrderDetailsList;