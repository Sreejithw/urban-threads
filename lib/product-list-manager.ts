import { z } from "zod";
import { toDecimalString } from "./utils";

const priceFormat = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(toDecimalString(Number(value))), 'Price must have exactly 2 decimal places')

export const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be atleast 8 characters')
})

export const userRegisterSchema = z.object({
    name: z.string().min(3, 'Name must have at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be atleast 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm Password must be atleast 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "New Password and Confirm Password do not match",
    path: ['confirmPassword']
})

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

export const productCartSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    image: z.string().min(1, 'Image is required'),
    price: priceFormat,
    qty: z.number().int().nonnegative('Quantity must be not be negative'),
})

export const cartSchema = z.object({
    cartItems: z.array(productCartSchema),
    subtotal: priceFormat,
    grandTotal: priceFormat,
    shippingPrice: priceFormat,
    taxAmount: priceFormat,
    userId: z.string().optional().nullable(),
    cartSessionId: z.string().min(1, 'Cart Session id is required'),
});

  