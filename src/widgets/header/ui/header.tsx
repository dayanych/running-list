import { LuBookOpen, LuSettings } from 'react-icons/lu';

import { routesPaths } from '@/shared/config';
import { PageHeader } from '@/shared/ui';

import { useHeader } from '..';
import { HeaderAction } from './header-action';

export const Header = () => {
  const { user } = useHeader();

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
      <HeaderAction
        label="Settings"
        icon={LuSettings}
        to={`/${routesPaths.settings}`}
      />
    </PageHeader>
  );
};
