import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlignJustifyIcon, ShoppingCartIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import UserBadge from "./user";
import Search from "../search";

const ProfileSection = () => {
    return <div className="flex justify-end gap-3">
        <nav className="hidden md:flex w-full max-w-xs gap-1">
            <Button asChild variant="ghost">
                <Link href='/cart'>
                    <ShoppingCartIcon /> Cart
                </Link>
            </Button>
            <UserBadge />
        </nav>
        <nav className="md:hidden">
            <Sheet>
                <SheetTrigger className="align-middle">
                    <AlignJustifyIcon />
                </SheetTrigger>
                <SheetContent className="flex flex-col items-start">
                    <div className='mt-10'>
                        <Search />
                    </div>
                    <SheetTitle>Menu</SheetTitle>
                    <Button asChild variant='ghost'>
                        <Link href='/cart'>
                            <ShoppingCartIcon /> Cart
                        </Link>
                    </Button>
                    <UserBadge />
                    <SheetDescription></SheetDescription>
                </SheetContent>
            </Sheet>
        </nav>
    </div>;
}
 
export default ProfileSection;