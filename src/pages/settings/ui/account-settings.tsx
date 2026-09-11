import { useUser } from '@/shared/lib';

export const AccountSettings = () => {
  const user = useUser();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="type-eyebrow text-ink-muted">Email</p>
        <p className="type-row">{user?.email}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="type-eyebrow text-ink-muted">Name</p>
        <p className="type-row">{user?.name}</p>
      </div>
    </div>
  );
};
