import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';

interface Props {
  label: string;
  icon: IconType;
  to?: string;
  onClick?: () => void;
  danger?: boolean;
}

/** Renders a header icon action with a label revealed on hover or focus */
export const HeaderAction = ({
  label,
  icon: Icon,
  to,
  onClick,
  danger = false,
}: Props) => {
  const className = cn(
    'header-action h-11 min-w-11 rounded-none px-2.5 duration-200 motion-reduce:transition-none',
    danger
      ? 'border-destructive text-destructive hover:border-destructive hover:bg-destructive-wash hover:text-destructive focus-visible:ring-destructive'
      : 'text-ink-secondary hover:border-primary',
  );
  const content = (
    <>
      <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.5} />
      <span className="header-action-label" aria-hidden="true">
        <span className="min-w-0 overflow-hidden">
          <span className="pl-2">{label}</span>
        </span>
      </span>
    </>
  );

  if (to) {
    return (
      <Button asChild variant="outline" className={className}>
        <Link to={to} aria-label={label}>
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      aria-label={label}
      onClick={onClick}
    >
      {content}
    </Button>
  );
};
