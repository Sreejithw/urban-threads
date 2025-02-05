'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/lib/actions/auth.actions";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const RegisterForm = () => {
    const [data, action] = useActionState(registerAction, { success: false, message: ''})
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    })
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    
    const RegisterButton = () => {
        const { pending } = useFormStatus();
        return (<Button disabled={pending} className="w-full" variant='default'>
            {pending ? 'Signing Up...' : 'Sign Up'}
        </Button>);
    };
    
    return <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl}/>
        <div className="space-y-6"> 
            <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    autoComplete="name"
                    defaultValue={''}
                />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    name="email" 
                    type="text" 
                    autoComplete="email"
                    defaultValue={''}
                />
            </div>
            <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    name="password" 
                    type={showPassword.password ? 'text' : 'password'} 
                    autoComplete="password"
                    defaultValue={''}
                    required 
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-[0.7rem] h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                >
                    {   showPassword.password ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />    }
                    <span className="sr-only">{showPassword.password ? 'Hide password' : 'Show password'}</span>
			    </Button>
            </div>
            <div className="relative">
                <Label htmlFor="password">Confirm Password</Label>
                <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type={showPassword.confirmPassword ? 'text' : 'password'} 
                    autoComplete="confirmPassword"
                    defaultValue={''}
                    required 
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-[0.7rem] h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                >
                     {showPassword.confirmPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                     <span className="sr-only">{showPassword.confirmPassword ? 'Hide password' : 'Show password'}</span>
			    </Button>
            </div>
            <div>
                <RegisterButton />
            </div>

            {
                data && !data.success && (
                    <div className="text-center text-destructive">{data.message}</div>
                )
            }
            <div className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href='/login' target="_self" className="link">
                    Log in
                </Link>
            </div>
        </div>
    </form>;
}
 
export default RegisterForm;