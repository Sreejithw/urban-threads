'use server';

import { signIn, signOut } from "@/auth";
import { signInSchema, userRegisterSchema } from "../product-list-manager"
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getErrorMessage } from "../utils";


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

        user.password = hashSync(user.password, 10);

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