import { getUserByIdAction } from '@/lib/actions/auth.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UserForm from './user-form';

export const metadata: Metadata = {
  title: 'Update user',
};

const UpdateUserPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const user = await getUserByIdAction(id);

  if (!user) notFound();

  console.log(user);

  return (
    <div className='space-y-8 max-w-lg mx-auto'>
      <h1 className='h2-bold'>Update User</h1>
      <UserForm user={user} /> 
    </div>
  );
};

export default UpdateUserPage;