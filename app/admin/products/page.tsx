import { Button } from "@/components/ui/button";
import DeletePopup from "@/components/ui/common/popup/delete-popup";
import Pagination from "@/components/ui/common/tablecontrols/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteProductAction, getAllProductsAction } from "@/lib/actions/product.actions";
import { formatCurrency, maskDynamicId } from "@/lib/utils";
import Link from "next/link";

const AdminProductListPage = async(props: {
    searchParams: Promise<{
        page: string,
        query: string,
        category: string
    }>
}) => {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const searchQuery = searchParams.query || '';
    const category = searchParams.category || '';

    const products = await getAllProductsAction({
        query: searchQuery, 
        page, 
        category
    });

    console.log(products);

    return ( 
        <div className='space-y-2'>
            <div className='flex-between'>
                <div className='flex items-center gap-3'>
                    <h1 className='h2-bold'>Products</h1>
                    {searchQuery && (
                        <div>
                            Filtered by <i>&quot;{searchQuery}&quot;</i>{' '}
                            <Link href={`/admin/products`}>
                                <Button variant='outline' size='sm'>
                                Remove Filter
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                <Button asChild variant='default'>
                    <Link href='/admin/products/create'>Create Product</Link>
                </Button>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>NAME</TableHead>
                            <TableHead className="text-right">PRICE</TableHead>
                            <TableHead>CATEGORY</TableHead>
                            <TableHead>STOCK</TableHead>
                            <TableHead>RATING</TableHead>
                            <TableHead className='w-[100px]'>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{maskDynamicId(product.id)}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell className='text-right'>
                                {formatCurrency(product.price)}
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.rating}</TableCell>
                                <TableCell className='flex gap-1'>
                                <Button asChild variant='outline' size='sm'>
                                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                                </Button>
                                    <DeletePopup id={product.id} action={deleteProductAction} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {products?.totalPages && products.totalPages > 1 && (
                    <Pagination page={page} totalPages={products.totalPages} />
                )}
            </div>
        </div> 
    );
}
 
export default AdminProductListPage;