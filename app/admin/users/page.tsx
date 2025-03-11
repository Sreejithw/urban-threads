import { Button } from '@/components/ui/button';
import DeletePopup from '@/components/ui/common/popup/delete-popup';
import Pagination from '@/components/ui/common/tablecontrols/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteUserAction, getAllUsersAction } from '@/lib/actions/auth.actions';
import { maskDynamicId } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Users',
};

const AdminUserListPage = async (props: {
    searchParams: Promise<{
      page: string;
      query: string;
    }>;
  }) => {
    const searchParams = await props.searchParams;

    const { page = '1', query: searchQuery } = searchParams;

    const users = await getAllUsersAction({ page: 1, query: searchQuery });

    return (
        <div className='space-y-2'>
            <div className='flex items-center gap-3'>
                <h1 className='h2-bold'>Users</h1>
                {searchQuery && (
                    <div>
                    Filtered by <i>&quot;{searchQuery}&quot;</i>{' '}
                    <Link href={`/admin/users`}>
                        <Button variant='outline' size='sm'>
                        Remove Filter
                        </Button>
                    </Link>
                    </div>
                )}
            </div>
            <div>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>NAME</TableHead>
                    <TableHead>EMAIL</TableHead>
                    <TableHead>ROLE</TableHead>
                    <TableHead>ACTIONS</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users?.data.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell>{maskDynamicId(user.id)}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className='flex gap-1'>
                        <Button asChild variant='outline' size='sm'>
                        <Link href={`/admin/users/${user.id}`}>Edit</Link>
                        </Button>
                        <DeletePopup id={user.id} action={deleteUserAction} />
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            {users?.totalPages && users.totalPages > 1 && (
                <Pagination page={page} totalPages={users.totalPages} />
            )}
            </div>
        </div>
    );
};

export default AdminUserListPage;