import { useState } from 'react';

import { useUser } from '@/shared/lib';

import { type SidebarItem, SidebarItemId } from '../ui';

export const useSettingsPage = () => {
  const user = useUser();
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    {
      id: SidebarItemId.Account,
      label: 'Account',
      isActive: true,
    },
    {
      id: SidebarItemId.Interface,
      label: 'Interface',
      isActive: false,
    },
    {
      id: SidebarItemId.Dates,
      label: 'Dates',
      isActive: false,
    },
  ]);

  const handleSidebarItemClick = (id: string) => {
    setSidebarItems((prev) =>
      prev.map((item) => ({ ...item, isActive: item.id === id })),
    );
  };

  const activeItem = sidebarItems.find((item) => item.isActive);

  return {
    user,
    sidebarItems,
    activeItem,
    handleSidebarItemClick,
  };
};
