import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      subtotal: {
        needs: { subtotal: true },
        compute(cart){
          return cart.subtotal.toString();
        }
      },
      grandTotal: {
        needs: { grandTotal: true },
        compute(cart){
          return cart.grandTotal.toString();
        }
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart){
          return cart.shippingPrice.toString();
        }
      },
      taxAmount: {
        needs: { taxAmount: true },
        compute(cart){
          return cart.taxAmount.toString();
        }
      },
    },
    order: {
      subtotal: {
        needs: { subtotal: true },
        compute(cart) {
          return cart.subtotal.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString();
        },
      },
      taxAmount: {
        needs: { taxAmount: true },
        compute(cart) {
          return cart.taxAmount.toString();
        },
      },
      grandTotal: {
        needs: { grandTotal: true },
        compute(cart) {
          return cart.grandTotal.toString();
        },
      },
    },
    orderItem: {
      price: {
        needs: { price: true },
        compute(cart){
          return cart.price.toString();
        }
      },
    }
  },
});
