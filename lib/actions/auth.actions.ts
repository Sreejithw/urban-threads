'use server';

import { paymentTypesSchema, updateUserSchema } from './../product-list-manager';
import { auth, signIn, signOut } from "@/auth";
import { shippingDetailsSchema, signInSchema, userRegisterSchema } from "../product-list-manager"
import { hash } from '../encrypt';
import { prisma } from "@/db/prisma";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getErrorMessage } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from 'zod';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';


export async function signInAction(prevState: unknown, formData: FormData){
    try {
        const user = signInSchema.parse({
            email: formData.get('email'),
            password: formData.get('password'),
        });

        await signIn('credentials', user)

        return { success: true, message: 'Signed in successfully' };
    } catch (error) {
        console.log('asds')
        if(isRedirectError(error)){
            throw error
        }

        return { success: false, message: 'Invalid email/password' };
    }
}

export async function signOutAction(){
    await signOut();
}

export async function registerAction(prevState: unknown, formData: FormData){
    try {
        const user = userRegisterSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        });

        const currPassword = user.password;

        user.password = await hash(user.password);

        await prisma.user.create({
            data:{
                name: user.name,
                email: user.email,
                password: user.password,
            }
        });

        await signIn('credentials', {
            email: user.email,
            password: currPassword
        })

        return { success: true, message: "Successfully registered"}
    } catch (error) {
        if(isRedirectError(error)){
            throw error
        }
        return { success: false, message: getErrorMessage(error)}
    }
}

export async function getUserByIdAction(userId: string){
    const user = prisma.user.findFirst({
        where: { id: userId },
    });

    if(!user) throw new Error('User not found');
    return user;
}

export async function updateAddressAction(data: ShippingAddress) {
    try {
      const session = await auth();
  
      const currentUser = await prisma.user.findFirst({
        where: { id: session?.user?.id },
      });
  
      if (!currentUser) throw new Error('User not found');
  
      const address = shippingDetailsSchema.parse(data);
  
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { address },
      });
  
      return {
        success: true,
        message: 'User updated successfully',
      };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
}

export async function updatePaymentTypeAction(data: z.infer<typeof paymentTypesSchema>) {
    try {
        const session = await auth();

        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        });

        if(!currentUser) throw new Error('User not found');

        const paymentMethod = paymentTypesSchema.parse(data);

        await prisma.user.update({
            where: { id: currentUser.id },
            data: { paymentType: paymentMethod.paymentType}
        })

        return {
            success: true,
            message: 'User updated successfully',
        }
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}

export async function updateProfile(user: { name: string; email: string }) {
    try {
      const session = await auth();
  
      const currentUser = await prisma.user.findFirst({
        where: {
          id: session?.user?.id,
        },
      });
  
      if (!currentUser) throw new Error('User not found');
  
      await prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          name: user.name,
        },
      });
  
      return {
        success: true,
        message: 'User details updated successfully',
      };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
}

export async function getAllUsersAction({
  limit = PAGE_SIZE,
  page,
  query
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
  query && query !== 'all'
    ? {
        name: {
          contains: query,
          mode: 'insensitive',
        } as Prisma.StringFilter,
      }
    : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteUserAction(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function updateUserAction(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}