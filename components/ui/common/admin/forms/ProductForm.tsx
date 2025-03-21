'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_PRODUCT_VALUES } from "@/lib/constants";
import { addProductSchema, updateProductSchema } from "@/lib/product-list-manager";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import slugify from 'slugify';
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { UploadImages } from "@/lib/uploadImages";
import { Checkbox } from "@/components/ui/checkbox";

const ProductForm = ({
    type,
    product,
    productId,
  }: {
    type: 'Create' | 'Update';
    product?: Product;
    productId?: string;
  }) => {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof addProductSchema>>({
        resolver:
          type === 'Update'
            ? zodResolver(updateProductSchema)
            : zodResolver(addProductSchema),
        defaultValues: product && type === 'Update' ? product : DEFAULT_PRODUCT_VALUES,
    });

    const onSubmit: SubmitHandler<z.infer<typeof addProductSchema>> = async (
        values
      ) => {
        if (type === 'Create') {
          const res = await createProduct(values);
      
          if (!res.success) {
            toast({
              variant: 'destructive',
              description: res.message,
            });
          } else {
            toast({
              description: res.message,
            });
            router.push(`/admin/products`);
          }
        }
        if (type === 'Update') {
          if (!productId) {
            router.push(`/admin/products`);
            return;
          }
      
          const res = await updateProduct({ ...values, id: productId });
      
          if (!res.success) {
            toast({
              variant: 'destructive',
              description: res.message,
            });
          } else {
            router.push(`/admin/products`);
          }
        }
    };

    const images = form.watch('images');
    const isFeatured = form.watch('isFeatured');
    const banner = form.watch('banner');
  
    return (
        <Form {...form}>
            <form method="post" onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name='name'
                        render={({
                        field,
                        }: {
                        field: ControllerRenderProps<z.infer<typeof addProductSchema>, 'name'>;
                        }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter product name' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    {/* Slug */}
                    <FormField
                        control={form.control}
                        name='slug'
                        render={({
                        field,
                        }: {
                        field: ControllerRenderProps<z.infer<typeof addProductSchema>, 'slug'>;
                        }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                            <div className='relative'>
                                <Input
                                placeholder='Enter product slug'
                                className='pl-8'
                                {...field}
                                />
                                <Button
                                    type='button'
                                    className='bg-gray-500 text-white px-4 py-1 mt-2 hover:bg-gray-600'
                                    onClick={() => {
                                        form.setValue('slug', slugify(form.getValues('name'), { lower: true }));
                                    }}
                                >
                                    Generate
                                </Button>
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                    {/* Category */}
                    <FormField
                        control={form.control}
                        name='category'
                        render={({
                        field,
                        }: {
                        field: ControllerRenderProps<
                            z.infer<typeof addProductSchema>,
                            'category'
                        >;
                        }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                            <Input placeholder='Enter category' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    {/* Brand */}
                    <FormField
                        control={form.control}
                        name='brand'
                        render={({
                        field,
                        }: {
                        field: ControllerRenderProps<
                            z.infer<typeof addProductSchema>,
                            'brand'
                        >;
                        }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                            <Input placeholder='Enter product brand' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className='flex flex-col gap-5 md:flex-row'>
                     {/* Price */}
                    <FormField
                        control={form.control}
                        name='price'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                            z.infer<typeof addProductSchema>,
                            'price'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input placeholder='Enter product price' {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {/* Stock */}
                        <FormField
                        control={form.control}
                        name='stock'
                        render={({
                            field,
                        }: {
                            field: ControllerRenderProps<
                            z.infer<typeof addProductSchema>,
                            'stock'
                            >;
                        }) => (
                            <FormItem className='w-full'>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                                <Input type='number' placeholder='Enter product stock' {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='upload-field flex flex-col gap-5 md:flex-row'>
                    <FormField
                    control={form.control}
                    name='images'
                    render={() => (
                    <FormItem className='w-full'>
                        <FormLabel>Images</FormLabel>
                            <Card>
                            <CardContent className='space-y-2 mt-2 min-h-48'>
                                <div className='flex-start space-x-2'>
                                {images.map((image: string) => (
                                    <Image
                                        key={image}
                                        src={image}
                                        alt='product image'
                                        className='w-20 h-20 object-cover object-center rounded-sm'
                                        width={100}
                                        height={100}
                                    />
                                ))}
                                <FormControl>
                                    <UploadImages
                                    endpoint='imageUploader'
                                    onClientUploadComplete={(res: { url: string }[]) => {
                                        form.setValue('images', [...images, res[0].url]);
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast({
                                        variant: 'destructive',
                                        description: `ERROR! ${error.message}`,
                                        });
                                    }}
                                    />
                                </FormControl>
                                </div>
                            </CardContent>
                            </Card>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className='upload-field'>
                    {/* Is Featured */}
                    Featured Product
                    <Card>
                        <CardContent className='space-y-2 mt-2  '>
                        <FormField
                            control={form.control}
                            name='isFeatured'
                            render={({ field }) => (
                            <FormItem className='space-x-2 items-center'>
                                <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                </FormControl>
                                <FormLabel>Is Featured?</FormLabel>
                            </FormItem>
                            )}
                        />
                        {isFeatured && banner && (
                            <Image
                            src={banner}
                            alt='banner image'
                            className=' w-full object-cover object-center rounded-sm'
                            width={1920}
                            height={680}
                            />
                        )}
                        {isFeatured && !banner && (
                            <UploadImages
                            endpoint='imageUploader'
                            onClientUploadComplete={(res: { url: string }[]) => {
                                form.setValue('banner', res[0].url);
                            }}
                            onUploadError={(error: Error) => {
                                toast({
                                variant: 'destructive',
                                description: `ERROR! ${error.message}`,
                                });
                            }}
                            />
                        )}
                        </CardContent>
                    </Card>
                </div>
                <div>
                    {/* Description */}
                    <FormField
                    control={form.control}
                    name='description'
                    render={({
                        field,
                    }: {
                        field: ControllerRenderProps<
                        z.infer<typeof addProductSchema>,
                        'description'
                        >;
                    }) => (
                        <FormItem className='w-full'>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder='Enter product description'
                                className='resize-none'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div>
                    <Button type="submit" size='lg' disabled={form.formState.isSubmitting} className="button col-span-2 w-full">
                        {
                            form.formState.isSubmitting ? 'Submitting' : `${type} Product`
                        }
                    </Button>
                </div>
            </form>
        </Form>
    );
  };
 
export default ProductForm;