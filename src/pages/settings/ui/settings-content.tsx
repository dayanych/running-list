import {
  AccountSettings,
  DatesSettings,
  InterfaceSettings,
  type SidebarItem,
  SidebarItemId,
} from './';

interface SettingsContentProps {
  activeItem: SidebarItem;
}

export const SettingsContent = ({ activeItem }: SettingsContentProps) => {
  return (
    <div className="flex flex-col gap-4">
      {activeItem.id === SidebarItemId.Account && <AccountSettings />}
      {activeItem.id === SidebarItemId.Interface && <InterfaceSettings />}
      {activeItem.id === SidebarItemId.Dates && <DatesSettings />}
    </div>
  );
};
