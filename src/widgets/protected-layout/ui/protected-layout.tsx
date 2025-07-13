import { Header } from '@/widgets';

import { useProtectedLayout } from '../lib/use-protected-layout';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  useProtectedLayout();

  return (
    <div className="flex h-screen flex-col">
      <Header />
      {children}
    </div>
  );
};
