import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPANY_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./register";

export const metadata: Metadata = {
    title: "Sign Up"
}

const RegisterPage = async (props: {
    searchParams: Promise<{
        callbackUrl: string
    }>
}) => {

    const{callbackUrl} = await props.searchParams;

    const session = await auth();

    if (session) {
        return redirect(callbackUrl || '/');
    }
    
    return <div className="w-full max-w-md mx-auto">
        <Card className="bg-transparent backdrop-blur-sm border border-white">
            <CardHeader className="space-y-4 pt-4">
                <Link href='/' className="flex-center">
                    <Image className="rounded-full" src='/images/uTLogo.png' width={100} height={100} alt={`${COMPANY_NAME} logo`} priority={true}/>
                </Link>
                <CardTitle className="text-center">Create Your Account</CardTitle>
                <CardDescription className="text-center">
                    Provide your details below
                </CardDescription>
                <CardContent className="space-y-4">
                    <RegisterForm />
                </CardContent>
            </CardHeader>
        </Card>
    </div>;
}
 
export default RegisterPage;