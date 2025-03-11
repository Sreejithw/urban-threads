import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db/prisma';
import { compare } from './lib/encrypt';
import { NextResponse } from 'next/server';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';

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
                    const isPasswordMatching = await compare(credentials.password as string, user.password);
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
        async jwt({ session,token, user, trigger}: any){
            if(user){
                token.id = user.id;
                token.role = user.role;
            
                if(user.name === 'NOT_FOUND') {
                    token.name = user.email!.split('@')[0];
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name }
                    });
                }
                console.log(trigger)
                if (trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObject = await cookies();
                    const cartSessionId = cookiesObject.get('cartSessionId')?.value;
              
                    if (cartSessionId) {
                      const sessionCart = await prisma.cart.findFirst({
                        where: { cartSessionId },
                      });
              
                      if (sessionCart) {
                        // Overwrite any existing user cart
                        await prisma.cart.deleteMany({
                          where: { userId: user.id },
                        });
              
                        // Assign the guest cart to the logged-in user
                        await prisma.cart.update({
                          where: { id: sessionCart.id },
                          data: { userId: user.id },
                        });
                      }
                    }
                  }
            }

            if(session?.user.name && trigger === "update"){
                token.name = session.user.name;
            }
            return token;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authorized({ request }: any) {
            const protectedPaths = [
                /\/shipping/,
                /\/payments/,
                /\/purchase/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ];

            // Get pathname from the req URL object
            const { pathname } = request.nextUrl;

            // Check if user is not authenticated and on a protected path
            if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

            
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