import { addProductSchema, productCartSchema, cartSchema, shippingDetailsSchema, addOrderItemSchema, addOrderSchema, paymentDetailsSchema, addReviewSchema } from "@/lib/product-list-manager";
import { z } from "zod";

export type Product = z.infer<typeof addProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
}

export type Cart = z.infer<typeof cartSchema>
export type CartItem = z.infer<typeof productCartSchema>
export type ShippingAddress = z.infer<typeof shippingDetailsSchema>;
export type OrderItem = z.infer<typeof addOrderItemSchema>;
// export type Order = z.infer<typeof addOrderSchema> & {
//   id: string;
//   isPaid: boolean;
//   paidAt: Date | null;
//   isDelivered: boolean;
//   timeOfDelivery: Date | null;
//   creationTime: Date;
//   orderitems: OrderItem[];
//   user: { name: string; email: string };
// };
export type Order = z.infer<typeof addOrderSchema> & {
  id: string;
  creationTime: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  timeOfDelivery: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentDetails; // 👈 Add this line
};

export type PaymentDetails = z.infer<typeof paymentDetailsSchema>;

export type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

export type Review = z.infer<typeof addReviewSchema> & {
  id: string;
  creationTime: Date;
  user?: { name: string };
};

