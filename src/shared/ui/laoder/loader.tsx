import { LuLoaderCircle } from 'react-icons/lu';

export const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LuLoaderCircle className="h-20 w-20 animate-spin text-primary" />
    </div>
  );
};
