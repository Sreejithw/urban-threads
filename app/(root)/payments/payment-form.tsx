'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { updatePaymentTypeAction } from "@/lib/actions/auth.actions";
import { DEFAULT_PAYMENT_TYPE, PAYMENT_TYPES } from "@/lib/constants";
import { paymentTypesSchema } from "@/lib/product-list-manager";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PaymentForm = ({paymentMethod} : { paymentMethod: string | null }) => {
    const router = useRouter();
    const { toast } = useToast();
  
    const form = useForm<z.infer<typeof paymentTypesSchema>>({
        resolver: zodResolver(paymentTypesSchema),
        defaultValues: {
          paymentType: paymentMethod || DEFAULT_PAYMENT_TYPE,
        },
    });

    const [isPending, startTransition] = useTransition();

    async function onSubmit(values: z.infer<typeof paymentTypesSchema>) {
        console.log(values);
        startTransition(async () => {
          const res = await updatePaymentTypeAction(values);
      
          if (!res.success) {
            toast({
              variant: 'destructive',
              description: res.message,
            });
      
            return;
          }
      
          router.push('/purchase');
        });
    }

    return (
        <>
            <div className='max-w-md mx-auto relative z-10'>
                <Form {...form}>
                    <form
                        method='post'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <h1 className='h2-bold mt-4'>Payment Method</h1>
                        <p className='text-sm'>
                            Please select your preferred payment method
                        </p>
                        <div className='flex flex-col gap-5 md:flex-row'>
                            <FormField
                                control={form.control}
                                name='paymentType'
                                render={({ field }) => (
                                    <FormItem className='space-y-3'>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            className='flex flex-col space-y-2'
                                        >
                                        {
                                            PAYMENT_TYPES.map((paymentType) => (
                                                <FormItem
                                                    key={paymentType}
                                                    className='flex items-center space-x-3 space-y-0'
                                                >
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value={paymentType}
                                                        checked={field.value === paymentType}
                                                    />
                                                </FormControl>
                                                <FormLabel className='font-normal'>
                                                    {paymentType}
                                                </FormLabel>
                                                </FormItem>
                                            ))
                                        }
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex gap-2'>
                            <Button type='submit' disabled={isPending}>
                            {isPending ? (
                                <Loader className='animate-spin w-4 h-4' />
                            ) : (
                                <ArrowRight className='w-4 h-4' />
                            )}
                            Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default PaymentForm;