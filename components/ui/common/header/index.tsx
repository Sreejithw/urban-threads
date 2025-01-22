import Image from "next/image";
import Link from "next/link";
import { COMPANY_NAME } from "@/lib/constants";
import ProfileSection from "./profile/profile";

const Header = () => {
    return <header className="w-full border-b">
        <div className="wrapper flex-between">
            <div className="flex-start">
                <Link href="/" className="flex-start">
                    <Image alt={`${COMPANY_NAME} brand`} src={'/images/favicon.png'} height={48} width={48} priority={true}/>
                    <span className="hidden lg:block font-bold text-2xl ml-3">
                        {COMPANY_NAME}
                    </span>
                </Link>
            </div>
            <ProfileSection />
        </div>
    </header>;
}
 
export default Header;