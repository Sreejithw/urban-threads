'use server'
import { prisma } from '@/db/prisma'
import { convertToJSON, getErrorMessage } from '../utils';
import { NEW_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { addProductSchema, updateProductSchema } from '../product-list-manager';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export async function getNewProducts() {
    const data = await prisma.product.findMany({
        take: NEW_PRODUCTS_LIMIT,
        orderBy: { createdAt: 'desc'}
    });

    return convertToJSON(data);
}

export async function getSelectedProduct(slug: string){
    return await prisma.product.findFirst({
        where: { slug: slug },
    });
} 

export async function getAllProductsAction({
    query,
    limit = PAGE_SIZE,
    page,
    category,
    price,
    rating,
    sort,
}: {
  query: string;
  category: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  
    const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
    ? {
        name: {
          contains: query,
          mode: 'insensitive',
        } as Prisma.StringFilter,
      }
    : {};

    const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]),
          },
        }
    : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};

    const ratingFilter = rating && rating !== 'all' ? { rating: { gte: Number(rating) } } : {};
    
    const data = await prisma.product.findMany({
        where: {
          ...queryFilter,
          ...categoryFilter,
          ...priceFilter,
          ...ratingFilter,
        },
        orderBy:
          sort === 'lowest'
            ? { price: 'asc' }
            : sort === 'highest'
            ? { price: 'desc' }
            : sort === 'rating'
            ? { rating: 'desc' }
            : { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.product.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
}

export async function deleteProductAction(id: string) {
    try {
      const productExists = await prisma.product.findFirst({
        where: { id },
      });
  
      if (!productExists) throw new Error('Product not found');
  
      await prisma.product.delete({ where: { id } });
  
      revalidatePath('/admin/products');
  
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  }

  export async function createProduct(data: z.infer<typeof addProductSchema>) {
    try {
      // Validate and create product
      const product = addProductSchema.parse(data);
      await prisma.product.create({ data: product });
  
      revalidatePath('/admin/products');
  
      return {
        success: true,
        message: 'Product created successfully',
      };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  }

  export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
    try {
      // Validate and find product
      const product = updateProductSchema.parse(data);
      const productExists = await prisma.product.findFirst({
        where: { id: product.id },
      });
  
      if (!productExists) throw new Error('Product not found');
  
      // Update product
      await prisma.product.update({ where: { id: product.id }, data: product });
  
      revalidatePath('/admin/products');
  
      return {
        success: true,
        message: 'Product updated successfully',
      };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  }

  export async function getProductByIdAction(productId: string) {
    const data = await prisma.product.findFirst({
      where: { id: productId },
    });
  
    return convertToJSON(data);
  }

  export async function getAllCategoriesAction() {

    const data = await prisma.product.groupBy({
      by: ['category'],
      _count: true,
    });

    return data;
  }

  export async function getFeaturedProductsAction() {
    const data = await prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });
  
    return convertToJSON(data);
  }