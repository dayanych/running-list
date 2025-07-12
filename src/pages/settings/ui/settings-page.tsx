import { useSettingsPage } from '../lib/use-settings-page';
import { SettingsContent, SettingsSidebar } from './';

export const SettingsPage = () => {
  const { sidebarItems, activeItem, handleSidebarItemClick } =
    useSettingsPage();

  return (
    <div className="container relative my-3 flex h-dvh flex-col gap-4 pb-14">
      <p className="py-4 text-3xl font-bold">Settings</p>
      {/* <p className="text-muted-foreground">{user?.email}</p> */}
      <div className="flex gap-4">
        <SettingsSidebar
          sidebarItems={sidebarItems}
          handleSidebarItemClick={handleSidebarItemClick}
        />
        {activeItem && <SettingsContent activeItem={activeItem} />}
      </div>
    </div>
  );
};
