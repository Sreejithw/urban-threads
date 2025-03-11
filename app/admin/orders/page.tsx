import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import DeletePopup from '@/components/ui/common/popup/delete-popup';
import Pagination from '@/components/ui/common/tablecontrols/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteOrderAction, getAllOrdersAction } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, maskDynamicId } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Orders',
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const { page = '1', query: searchQuery } = await props.searchParams;

  const session = await auth();
  if (session?.user.role !== 'admin')
    throw new Error('admin permission required');

  const orders = await getAllOrdersAction({
    page: Number(page),
    query: searchQuery
  });

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
          <h1 className='h2-bold'>Ordefrs</h1>
          {searchQuery && (
              <div>
                  Filtered by <i>&quot;{searchQuery}&quot;</i>{' '}
                  <Link href={`/admin/orders`}>
                      <Button variant='outline' size='sm'>
                      Remove Filter
                      </Button>
                  </Link>
              </div>
          )}
      </div>
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
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{maskDynamicId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.creationTime).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.grandTotal)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'Not Paid'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.timeOfDelivery
                    ? formatDateTime(order.timeOfDelivery).dateTime
                    : 'Not Delivered'}
                </TableCell>
                <TableCell>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  <DeletePopup id={order.id} action={deleteOrderAction} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          />
        )}
      </div>
    </div>
  )
};

export default OrdersPage;