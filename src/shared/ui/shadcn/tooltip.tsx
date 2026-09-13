import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/shared/lib';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Floating label shown next to a tooltip trigger
 *
 * Speaks in the same voice as a notification toast: a square raised panel
 * carrying an accent rail, so both ways of addressing the user read as one
 *
 * @param sideOffset - Distance in pixels between the trigger and the label
 * @returns Portalled tooltip content
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    className?: string;
    sideOffset?: number;
    children?: React.ReactNode;
  }
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'type-ui relative z-50 max-w-xs border bg-surface-raised px-4 py-2.5 text-ink',
        'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-anchor before:content-[""]',
        // On the right side the arrow takes the left edge, so the rail moves to
        // the opposite edge rather than being cut in two by it
        'data-[side=right]:before:left-auto data-[side=right]:before:right-0',
        'data-[state=delayed-open]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=delayed-open]:duration-300 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0',
        'data-[state=instant-open]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=instant-open]:duration-300 data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0',
        'data-[state=closed]:duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        'motion-reduce:animate-none motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {children}
      {/* A square rotated by 45deg rather than a triangle: half of it slides
          under the panel and hides the border across the base, so the two
          outer edges read as one continuous outline. The classes are written
          in the local space of the arrow, which Radix rotates to face the
          trigger, so one pair of edges covers every side */}
      <TooltipPrimitive.Arrow className="size-2.5 translate-y-[calc(-50%_+_1px)] rotate-45 border-b border-r border-border bg-surface-raised fill-surface-raised" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
