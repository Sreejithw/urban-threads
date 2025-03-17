'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "@/lib/actions/auth.actions";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const LoginForm = () => {
    const [data, action] = useActionState(signInAction, { success: false, message: ''})
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    
    const LoginBtn = () => {
        const { pending } = useFormStatus();
        return (<Button disabled={pending} className="w-full" variant='default'>
            {pending ? 'Signing in...' : 'Sign In'}
        </Button>);
    };
    
    return <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl}/>
        <div className="space-y-6"> 
            <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email"
                    defaultValue={''}
                    required 
                />
            </div>
            <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="password"
                    defaultValue={''}
                    required 
                />
                 <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-[0.7rem] h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev: boolean) => !prev)}
                >
                    {   showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />    }
                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
			    </Button>
            </div>
            <div>
                <LoginBtn />
            </div>

            {
                data && !data.success && (
                    <div className="text-center text-destructive">{data.message}</div>
                )
            }
            <div className="text-sm text-center">
                Don&apos;t have an account?{' '}
                <Link href='/register' target="_self" className="link">
                    Sign Up
                </Link>
            </div>
        </div>
    </form>;
}
 
export default LoginForm;