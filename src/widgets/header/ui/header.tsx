import { Link } from 'react-router-dom';

import { Button, Logo } from '@/shared/ui';

import { useHeader } from '..';

export const Header = () => {
  const { user, onLogout } = useHeader();

  if (!user) {
    return null;
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Logo />
          <Link className="type-section" to="/">
            Running List
          </Link>
        </div>
        <Button
          type="button"
          variant="outline"
          className="type-key h-9 rounded-none px-4 text-destructive hover:border-destructive hover:bg-destructive-wash hover:text-destructive"
          onClick={onLogout}
        >
          Log out
        </Button>
      </div>
    </header>
  );
};
