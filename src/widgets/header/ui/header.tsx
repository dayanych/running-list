import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

import { WeekPicker } from '@/shared/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn';

import { useHeader } from '..';

const UserAvatar = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted">
        <User className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => {}}>Profile</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Header = () => {
  const { user, todayLink } = useHeader();

  if (!user) {
    return null;
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link className="text-xl font-bold" to="/">
          Running List
        </Link>
        <div className="flex items-center gap-5">
          <Link to={todayLink}>Today</Link>
          <WeekPicker onChange={() => {}} title="Calendar" />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
};
