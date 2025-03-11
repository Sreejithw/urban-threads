
import { Metadata } from "next";
import { auth } from "@/auth";
import { getUserByIdAction } from "@/lib/actions/auth.actions";
import PaymentForm from "./payment-form";
import Checkout from "@/components/ui/common/checkout/checkout";


export const metadata: Metadata ={
    title: 'Payment',
}

const PaymentPage = async() => {
    const session = await auth();
    const userId = session?.user?.id;
  
    if (!userId) {
      throw new Error('User ID not found');
    }
  
    const user = await getUserByIdAction(userId);
  
    return <>
        <Checkout current={2} />
        <PaymentForm paymentMethod={user!.paymentType} />
    </>
}
 
export default PaymentPage;