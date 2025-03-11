import Link from "next/link";
import { COMPANY_NAME } from "@/lib/constants";
import ProfileSection from "./profile/profile";
import ProductCategoryDrawer from "../drawer/product-category-drawer";
import Search from "./search";

const Header = () => {
    return <header className="h-16 border-b">
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-black bg-opacity-90">
            <div className="flex-start gap-3">
                <ProductCategoryDrawer />
                <Link href="/" className="flex-start text-white text-2xl font-bold">
                    {COMPANY_NAME}
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <div className='hidden md:block'>
                    <Search />
                </div>
                <ProfileSection />
            </div>
        </div>
    </header>;
}
 
export default Header;