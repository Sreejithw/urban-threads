import { addProductSchema } from "@/lib/product-list-manager";
import { z } from "zod";

export type Product = z.infer<typeof addProductSchema> & {
    id: string;
    rating: string;
    createdAt: Date;
}