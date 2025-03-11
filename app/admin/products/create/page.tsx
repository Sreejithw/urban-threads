import ProductForm from '@/components/ui/common/admin/forms/ProductForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create product',
};

const ProductCreatePage = () => {
    return (
        <>
          <h2 className='h2-bold'>Create Product</h2>
          <div className='my-8'>
            <ProductForm type='Create' />
          </div>
        </>
      );
}
 
export default ProductCreatePage;