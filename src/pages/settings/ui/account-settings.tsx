import { useUser } from '@/shared/lib';

export const AccountSettings = () => {
  const user = useUser();

  return (
    <div className="flex flex-col gap-4">
      {/* <p className="text-2xl font-bold">Account</p> */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Email</p>
        <p className="text-sm font-medium">{user?.email}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Name</p>
        <p className="text-sm font-medium">{user?.name}</p>
      </div>
    </div>
  );
};
