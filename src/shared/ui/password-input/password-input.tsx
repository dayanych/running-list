import * as React from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

import { cn } from '@/shared/lib';

import { Input, type InputProps } from '../shadcn/input';

type PasswordInputProps = Omit<InputProps, 'type'>;

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        className={cn('pr-10', className)}
        {...props}
      />
      <button
        type="button"
        aria-pressed={isVisible}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
        onClick={toggleVisibility}
      >
        <span className="relative flex h-4 w-4 items-center justify-center">
          <LuEye
            className={cn(
              'absolute h-4 w-4 transition-opacity duration-200',
              isVisible ? 'opacity-0' : 'opacity-100',
            )}
            aria-hidden="true"
          />
          <LuEyeOff
            className={cn(
              'absolute h-4 w-4 transition-opacity duration-200',
              isVisible ? 'opacity-100' : 'opacity-0',
            )}
            aria-hidden="true"
          />
        </span>
      </button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';
