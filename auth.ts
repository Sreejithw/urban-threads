import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db/prisma';
import { compareSync } from 'bcrypt-ts-edge';
import { NextResponse } from 'next/server';
import type { NextAuthConfig } from 'next-auth';

export const config ={
    pages:{
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials:{
                email: { type: 'email'},
                password: { type: 'password'},
            },
            async authorize(credentials) {
                if(credentials === null) return null;

                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                })

                if (user && user.password){
                    const isPasswordMatching = compareSync(credentials.password as string, user.password);
                    if (isPasswordMatching){
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }
                }
                return null;
            }
        })
    ],
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, user, eventType, token }: any) {
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;
            
            if(eventType === 'update'){
                session.user.name = user.name;
            }
            return session
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user}: any){
            if(user){
                token.role = user.role;
                if(user.name === 'NOT_FOUND') {
                    token.name = user.email!.split('@')[0];
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name }
                    });
                }
            }
            return token;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authorized({ request }: any) {
            if (!request.cookies.get('cartSessionId')) {
                const cartSessionId = crypto.randomUUID(); 

                const newRequestHeaders = new Headers(request.headers); 
            
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders,
                    },
                });

                response.cookies.set('cartSessionId', cartSessionId);

                return response;
            } else {
                return true;
            }
        },
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config)