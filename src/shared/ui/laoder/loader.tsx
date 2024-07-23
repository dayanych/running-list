import { LoaderCircle } from 'lucide-react';

export const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoaderCircle className="h-20 w-20 animate-spin text-primary" />
    </div>
  );
};
