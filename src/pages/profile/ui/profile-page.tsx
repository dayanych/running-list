import { useProfilePage } from '../lib/use-profile-page';

export const ProfilePage = () => {
  const { user } = useProfilePage();

  return (
    <div className="container">
      <p className="pt-4 text-3xl font-bold text-foreground">
        {user?.name ?? 'No name'}
      </p>
      <p className="text-muted-foreground">{user?.email}</p>
    </div>
  );
};
