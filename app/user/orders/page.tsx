import Pagination from '@/components/ui/common/tablecontrols/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMyOrderListAction } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, maskDynamicId } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'My Orders',
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {

    const { page } = await props.searchParams;
    const orders = await getMyOrderListAction({
        page: Number(page) || 1,
    });
    console.log(orders);

    return (
        <div className='space-y-2'>
            <h2 className='h2-bold'>Orders</h2>
            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>DATE</TableHead>
                            <TableHead>TOTAL</TableHead>
                            <TableHead>PAID</TableHead>
                            <TableHead>DELIVERED</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {
                        orders.data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{maskDynamicId(order.id)}</TableCell>
                                <TableCell> {formatCurrency(order.grandTotal)}</TableCell>
                                <TableCell>{formatCurrency(order.grandTotal)}</TableCell>
                                <TableCell>
                                    {order.isPaid && order.paidAt
                                    ? formatDateTime(order.paidAt).dateTime
                                    : 'not paid'}
                                </TableCell>
                                <TableCell>
                                    {order.isDelivered && order.timeOfDelivery
                                    ? formatDateTime(order.timeOfDelivery).dateTime
                                    : 'not delivered'}
                                </TableCell>
                                <TableCell>
                                    <Link href={`/order/${order.id}`}>
                                    <span className='px-2'>Details</span>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
                {
                    orders.totalPages > 1 && (
                        <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
                    )
                }
            </div>
        </div>
    )
}
 
export default OrdersPage;