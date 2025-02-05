import { addProductSchema, productCartSchema, cartSchema } from "@/lib/product-list-manager";
import { z } from "zod";

export type Product = z.infer<typeof addProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
}

export type Cart = z.infer<typeof cartSchema>
export type CartItem = z.infer<typeof productCartSchema>