'use server';

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToJSON, getErrorMessage } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserByIdAction } from "./auth.actions";
import { addOrderSchema } from "../product-list-manager";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentDetails, ShippingAddress } from "@/types";
import { paypal } from "../payments/paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from '../constants';
import { Prisma } from "@prisma/client";
import { sendPaymentReceipt } from "@/email";


export const purchaseOrderAction = async () => {
    try {
        const session = await auth();
        if (!session) throw new Error('User is not authorized');
        
        const cart = await getMyCart();
        const userId = session?.user?.id;
        if (!userId) throw new Error('User not found');
        
        
        const user = await getUserByIdAction(userId);
        
        if (!cart || cart.cartItems.length === 0) {
            return {
                success: false,
                message: 'Your cart is empty',
                redirectTo: '/cart',
            }
        }
        
        if (!user?.address) {
            return {
                success: false,
                message: 'No shipping addess provided',
                redirectTo: '/shipping',
            };
        }
        
        if (!user?.paymentType) {
            return {
                success: false,
                message: 'No payment method',
                redirectTo: '/payments',
            };
        }
        
        const order = addOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentType: user.paymentType,
            subtotal: cart.subtotal,
            shippingPrice: cart.shippingPrice,
            taxAmount: cart.taxAmount,
            grandTotal: cart.grandTotal
        });

        const createdOrderId = await prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({ data: order });
            for (const item of cart.cartItems as CartItem[]) {
                await tx.orderItem.create({
                  data: {
                    ...item,
                    price: item.price,
                    orderId: createdOrder.id,
                  },
                });
            }
            await tx.cart.update({
                where: { id: cart.id },
                data: {
                  cartItems: [],
                  grandTotal: 0,
                  shippingPrice: 0,
                  taxAmount: 0,
                  subtotal: 0,
                },
            });
            return createdOrder.id;
        });

        if (!createdOrderId) throw new Error('Order has not been created');

        return { success: true, message: 'Order created successfully', redirectTo: `/order/${createdOrderId}` };
    } catch (error) {
      if (isRedirectError(error)) throw error;
      return { success: false, message: getErrorMessage(error) };
    }
};

export async function getOrderByIdAction(orderId: string) {
    const data = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true } },
      },
    });
    return convertToJSON(data);
}

export async function createPayPalOrderAction(orderId: string) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
        },
      });
      if (order) {
        const paypalOrder = await paypal.createOrder(Number(order.grandTotal));
        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            paymentResult: {
              id: paypalOrder.id,
              email_address: '',
              status: '',
              transactionAmount: '0',
            },
          },
        });

        return {
          success: true,
          message: 'PayPal order created successfully',
          data: paypalOrder.id,
        };
      } else {
        throw new Error('Order not found');
      }
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
}

export async function approvePayPalOrderAction(
    orderId: string,
    data: { orderID: string }
  ) {
    try {
        const order = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        })
        if (!order) throw new Error('Order not found')

        const captureData = await paypal.capturePayment(data.orderID)
        if (
            !captureData ||
            captureData.id !== (order.paymentResult as PaymentDetails)?.id ||
            captureData.status !== 'COMPLETED'
        )
        throw new Error('Error in paypal payment')

        await updatePaymentStatusToPaidAction({
            orderId,
            paymentResult: {
                id: captureData.id,
                status: captureData.status,
                email_address: captureData.payer.email_address,
                transactionAmount:
                captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
            },
        });
    
        revalidatePath(`/order/${orderId}`)

        return {
        success: true,
        message: 'Your order has been successfully paid by PayPal',
        }
    } catch (err) {
      return { success: false, message: getErrorMessage(err) }
    }
}

// Update order to paid
export async function updatePaymentStatusToPaidAction({
    orderId,
    paymentResult,
  }: {
    orderId: string;
    paymentResult?: PaymentDetails;
  }) {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderitems: true,
      },
    });
  
    if (!order) throw new Error('Order not found');
  
    if (order.isPaid) throw new Error('Order is already paid');
  
    // Transaction to update order and account for product stock
    await prisma.$transaction(async (tx) => {
      // Iterate over products and update stock
      for (const item of order.orderitems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: -item.qty } },
        });
      }
  
      // Set the order to paid
      await tx.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult,
        },
      });
    });
  
    // Get updated order after transaction
    const updatedOrder = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        orderitems: true,
        user: { select: { name: true, email: true } },
      },
    });
  
    if (!updatedOrder) throw new Error('Order not found');

    // Send the purchase receipt email with the updated order
    sendPaymentReceipt({
      order: {
        ...updatedOrder,
        shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
        paymentResult: updatedOrder.paymentResult as PaymentDetails,
      },
    });
}

export async function getMyOrderListAction({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error('User is not authenticated');

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { creationTime: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const orderCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });

  return {
    data,
    totalPages: Math.ceil(orderCount / limit),
  };
}

export async function getOrderSummaryAction(){
  const orderCount = await prisma.order.count();
  const productCount = await prisma.product.count();
  const userCount = await prisma.user.count();

  const totalSales = await prisma.order.aggregate({
    _sum: { grandTotal: true }
  });

  const salesDataQuery = await prisma.$queryRaw<Array<{ month: string; totalSales: Prisma.Decimal }
    >>`SELECT to_char("creationTime", 'MM/YY') as "month", sum("grandTotal") as "totalSales" FROM "Order" GROUP BY to_char("creationTime", 'MM/YY')`;

  type SalesDataType = {
    month: string;
    totalSales: number;
  }[]

  const salesData: SalesDataType = salesDataQuery.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales)
  }));

  const recentOrders = await prisma.order.findMany({
    orderBy: { creationTime: 'desc'},
    include: {
      user: { select: { name: true } },
    },
    take: 6
  });

  return {
    orderCount,
    productCount,
    userCount,
    totalSales,
    salesData,
    recentOrders,
  }
}

export async function getAllOrdersAction({
  limit = PAGE_SIZE,
  page,
  query
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== 'all'
      ? {
          user: {
            name: {
              contains: query,
              mode: 'insensitive',
            } as Prisma.StringFilter,
          },
        }
  : {};

  const data = await prisma.order.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { creationTime: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteOrderAction(id: string) {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath('/admin/orders');

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function updateOrderPayStatusAction(orderId: string) {
  try {
    await updatePaymentStatusToPaidAction({ orderId });
    revalidatePath(`/order/${orderId}`);
    return { success: true, message: 'Order paid successfully' };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function deliverOrderAction(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');
    if (!order.isPaid) throw new Error('Order is not paid');

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        timeOfDelivery: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: 'Order delivered successfully' };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}