'use client';

import { Button } from "@/components/ui/button";
import { purchaseOrderAction } from "@/lib/actions/order.actions";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";


const PurchaseOrderForm = () => {
    const router = useRouter();

    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
    
        const res = await purchaseOrderAction();
        console.log(res)
    
        if (res.redirectTo) {
          router.push(res.redirectTo);
        }
    };

    const PurchaseBtn = () => {
        const { pending } = useFormStatus();
        return (
          <Button disabled={pending} className='w-full'>
            Place Order
            {pending ? (
              <Loader className='w-4 h-4 animate-spin' />
            ) : (
              <Check className='w-4 h-4' />
            )}{' '}
          </Button>
        );
    };
    return (
        <form onSubmit={handleSubmit} className='w-full'>
             <PurchaseBtn />
        </form>
    );
}
 
export default PurchaseOrderForm;