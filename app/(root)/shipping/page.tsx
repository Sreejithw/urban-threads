import { auth } from "@/auth";
import { getUserByIdAction } from "@/lib/actions/auth.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingForm from "./shipping-form";
import { ShippingAddress } from "@/types";
import Checkout from "@/components/ui/common/checkout/checkout";

export const metadata: Metadata = {
    title: "Shipping Address",
}

const ShippingAddressPage = async () => {
    const cart = await getMyCart();

    if(!cart || cart.cartItems.length === 0) redirect('/cart');

    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) throw new Error('User ID not found');

    const user = await getUserByIdAction(userId);

    return <>
        <Checkout current={1} />
        <ShippingForm address={ user?.address as ShippingAddress}/>
    </>;
}
 
export default ShippingAddressPage;