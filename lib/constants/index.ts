export const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Urban Threads';
export const COMPANY_DESCRIPTION = process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION || 'Modern street wear';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const NEW_PRODUCTS_LIMIT = Number(process.env.NEW_PRODUCTS_LIMIT || 4);
export const PAYMENT_TYPES = process.env.PAYMENT_TYPES ? process.env.PAYMENT_TYPES.split(', ') : ['PayPal', 'Stripe', 'COD'];
export const DEFAULT_PAYMENT_TYPE = process.env.DEFAULT_PAYMENT_TYPE || 'PayPal';
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 2;
export const DEFAULT_PRODUCT_VALUES = {
    name: '',
    slug: '',
    category: '',
    images: [],
    brand: '',
    description: '',
    price: '0',
    stock: 0,
    rating: '0',
    numReviews: '0',
    isFeatured: false,
    banner: null,
}

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(', ')
  : ['admin', 'user'];

export const reviewFormDefaultValues = {
  title: '',
  comment: '',
  rating: 0,
};

export const OWNER_EMAIL = process.env.OWNER_EMAIL || 'onboarding@resend.dev';