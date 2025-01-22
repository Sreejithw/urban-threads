import { z } from "zod";
import { toDecimalString } from "./utils";

const priceFormat = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(toDecimalString(Number(value))), 'Price must have exactly 2 decimal places')

export const addProductSchema = z.object({
    name: z.string().min(3, 'Name must have at least 3 characters'),
    slug: z.string().min(3, 'Slug must have at least 3 characters'),
    category: z.string().min(3, 'Category must have at least 3 characters'),
    brand: z.string().min(3, 'Brand must have at least 3 characters'),
    description: z.string().min(3, 'Description must have at least 3 characters'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'Product must have at least 1 image'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: priceFormat
});