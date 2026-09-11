import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';

export enum SidebarItemId {
  Account = 'account',
  Interface = 'interface',
  Dates = 'dates',
}

export interface SidebarItem {
  id: SidebarItemId;
  label: string;
  isActive: boolean;
}

interface SettingsSidebarProps {
  sidebarItems: SidebarItem[];
  handleSidebarItemClick: (id: string) => void;
}

export const SettingsSidebar = ({
  sidebarItems,
  handleSidebarItemClick,
}: SettingsSidebarProps) => {
  return (
    <div className="flex min-w-48 flex-col gap-2">
      {sidebarItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => handleSidebarItemClick(item.id)}
          className={cn(
            item.isActive && 'bg-primary text-primary-foreground',
            'type-row w-full justify-start',
          )}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};
