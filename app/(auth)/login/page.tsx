import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPANY_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Sign In"
}

const LoginPage = async (props: {
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
        <Card>
            <CardHeader className="space-y-4">
                <Link href='/' className="flex-center">
                    <Image src='/images/favicon.png' width={100} height={100} alt={`${COMPANY_NAME} logo`} priority={true}/>
                </Link>
                <CardTitle className="text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                    Log In to your account
                </CardDescription>
                <CardContent className="space-y-4">
                    <LoginForm />
                </CardContent>
            </CardHeader>
        </Card>
    </div>;
}
 
export default LoginPage;