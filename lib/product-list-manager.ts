import { z } from "zod";
import { toDecimalString } from "./utils";
import { PAYMENT_TYPES } from "./constants";

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

export const updateProductSchema = addProductSchema.extend({
    id: z.string().min(1, 'Id is required'),
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

export const shippingDetailsSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
    city: z.string().min(3, 'city must be at least 3 characters'),
    country: z.string().min(3, 'Country must be at least 3 characters'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
    lat: z.number().optional(),
    long: z.number().optional(),
});

export const paymentTypesSchema = z.object({
    paymentType: z.string().min(1, 'Payment type is required'),  
}).refine((data) => PAYMENT_TYPES.includes(data.paymentType), {
    path: ['paymentType'],
    message: 'Invalid payment type'
});

export const addOrderSchema = z.object({
    userId: z.string().min(1, 'User is required'),
    paymentType: z.string().refine((data) => PAYMENT_TYPES.includes(data), {
        message: 'Invalid payment method',
    }),
    shippingAddress: shippingDetailsSchema,
    shippingPrice: priceFormat,
    subtotal: priceFormat,
    taxAmount: priceFormat,
    grandTotal: priceFormat,
});

export const addOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: priceFormat,
    qty: z.number(),
});

export const paymentDetailsSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    transactionAmount: z.string(),
});

export const updateProfileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().min(3, 'Email must be at least 3 characters'),
});
  
export const updateUserSchema = updateProfileSchema.extend({
    id: z.string().min(1, 'Id is required'),
    name: z.string().min(3, 'Name must be at least 3 characters'),
    role: z.string().min(1, 'Role is required'),
});

export const addReviewSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    productId: z.string().min(1, 'Product is required'),
    userId: z.string().min(1, 'User is required'),
    rating: z.coerce
      .number()
      .int()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
  });