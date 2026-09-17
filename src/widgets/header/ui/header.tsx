import { LuBookOpen, LuLogOut } from 'react-icons/lu';

import { routesPaths } from '@/shared/config';
import { PageHeader } from '@/shared/ui';

import { useHeader } from '..';
import { HeaderAction } from './header-action';

export const Header = () => {
  const { user, onLogout } = useHeader();

  if (!user) {
    return null;
  }

  return (
    <PageHeader>
      <HeaderAction
        label="Guide"
        icon={LuBookOpen}
        to={`/${routesPaths.guide}`}
      />
      <HeaderAction label="Log out" icon={LuLogOut} danger onClick={onLogout} />
    </PageHeader>
  );
};
