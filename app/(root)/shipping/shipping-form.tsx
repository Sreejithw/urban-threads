'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ShippingAddress } from '@/types';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControllerRenderProps } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { shippingDetailsSchema } from '@/lib/product-list-manager';
import { updateAddressAction } from '@/lib/actions/auth.actions';


const ShippingForm = ({ address }: { address: ShippingAddress | null; }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [ isPending, startTransition ] = useTransition();
    const form = useForm<z.infer<typeof shippingDetailsSchema>>({
        resolver: zodResolver(shippingDetailsSchema),
        defaultValues: address || undefined,
    });

    const onSubmit: SubmitHandler<z.infer<typeof shippingDetailsSchema>> = async (values) => {
        startTransition(async () => {
            const res = await updateAddressAction(values);
        
            if (!res.success) {
              toast({
                variant: 'destructive',
                description: res.message,
              });
              return;
            }
        
            router.push('/payments');
        });
    }

    return <>
        <div className='max-w-md mx-auto space-y-4'>
            <h1 className='h2-bold mt-4'>Shipping Address</h1>
            <p className='text-sm text-muted-foreground'>
                Please enter shipping address
            </p>
            <Form {...form}>
                <form
                    method='post'
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    <div className='flex flex-col gap-5 md:flex-row'>
                        <FormField
                            control={form.control}
                            name='fullName'
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<
                                z.infer<typeof shippingDetailsSchema>,
                                'fullName'
                                >;
                            }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter full name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            control={form.control}
                            name='streetAddress'
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<
                                z.infer<typeof shippingDetailsSchema>,
                                'streetAddress'
                                >;
                            }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter address' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex flex-col gap-5 md:flex-row'>
                        <FormField
                            control={form.control}
                            name='city'
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<
                                z.infer<typeof shippingDetailsSchema>,
                                'city'
                                >;
                            }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter city' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='country'
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<
                                z.infer<typeof shippingDetailsSchema>,
                                'country'
                                >;
                            }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter country' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='postalCode'
                            render={({
                                field,
                            }: {
                                field: ControllerRenderProps<
                                z.infer<typeof shippingDetailsSchema>,
                                'postalCode'
                                >;
                            }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter postal code' {...field} />
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
    </>;
}
 
export default ShippingForm;