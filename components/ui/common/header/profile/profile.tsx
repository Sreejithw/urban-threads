import { Button } from "@/components/ui/button";
import ThemeToggle from "../theme-toggle";
import Link from "next/link";
import { AlignJustifyIcon, ShoppingCartIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import UserBadge from "./user";

const ProfileSection = () => {
    return <div className="flex justify-end gap-3">
        <nav className="hidden md:flex w-full max-w-xs gap-1">
            <ThemeToggle />
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
                    <SheetTitle>Menu</SheetTitle>
                    <ThemeToggle />
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