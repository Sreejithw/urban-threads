'use server'
import { prisma } from '@/db/prisma'
import { convertToJSON } from '../utils';
import { NEW_PRODUCTS_LIMIT } from '../constants';

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