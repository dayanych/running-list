import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <Outlet />
    </div>
  );
};
