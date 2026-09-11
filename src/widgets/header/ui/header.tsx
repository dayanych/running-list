import { LuUser } from 'react-icons/lu';
import { Link } from 'react-router-dom';

import { routesPaths } from '@/shared/config';
import { Logo } from '@/shared/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn';

import { useHeader } from '..';

interface UserAvatarProps {
  onLogout: () => void;
}

const UserAvatar = ({ onLogout }: UserAvatarProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted">
        <LuUser className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/${routesPaths.settings}`}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem danger onSelect={() => onLogout()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
        <UserAvatar onLogout={onLogout} />
      </div>
    </header>
  );
};
