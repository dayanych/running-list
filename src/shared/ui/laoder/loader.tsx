import { cn } from '@/shared/lib';

interface LoaderProps {
  fullScreen?: boolean;
  label?: string;
}

const LOADER_DOTS = Array.from({ length: 7 });

export const Loader = ({
  fullScreen = false,
  label = 'Loading',
}: LoaderProps) => {
  return (
    <div
      className={cn(
        'route-loader-enter flex w-full flex-1 items-center justify-center px-6',
        fullScreen ? 'min-h-screen' : 'min-h-[50vh]',
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-5">
        <div
          className="relative flex w-44 items-center justify-between"
          aria-hidden="true"
        >
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-rule" />
          {LOADER_DOTS.map((_, index) => (
            <span
              key={index}
              className="route-loader-dot relative h-1.5 w-1.5 rounded-full bg-anchor ring-4 ring-background"
              style={{ animationDelay: `${index * 110}ms` }}
            />
          ))}
        </div>
        <span className="type-meta text-ink-faint">{label}</span>
      </div>
    </div>
  );
};
