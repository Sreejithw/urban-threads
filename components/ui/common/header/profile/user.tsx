import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth.actions";

const UserBadge = async() => {
    const session = await auth();

    if(!session){
        return (
            <Button asChild>
                <Link href='/login'>
                    <UserIcon /> Sign In
                </Link>
            </Button>
        )
    }

    const userBadgeName = session.user?.name?.charAt(0).toUpperCase() ?? 'A';

    return <div className="flex gap-2 items-center">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center">
                    <Button variant='ghost' className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center border border-gray-200">
                        { userBadgeName }
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <div className="text-sm font-medium leading-none">
                            {session.user?.name}
                        </div>
                        <div className="text-sm text-muted-foreground leading-none">
                            {session.user?.email}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuItem>
                    <Link className="w-full" href="/user/profile">
                        User Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link className='w-full' href='/user/orders'>
                        Order History
                    </Link>
                </DropdownMenuItem>
                {
                    session?.user?.role === 'admin' && (
                        <DropdownMenuItem>
                            <Link className='w-full' href='/admin/dashboard'>
                                Admin
                            </Link>
                        </DropdownMenuItem>
                    )
                }
                <DropdownMenuItem className="p-0 mb-1">
                    <form action={signOutAction} className="w-full">
                        <Button className="w-full py-4 px-2 h-4 justify-start" variant='ghost'>
                            Sign Out
                        </Button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>;
}
 
export default UserBadge;