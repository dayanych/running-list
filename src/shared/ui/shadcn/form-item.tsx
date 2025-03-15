/* eslint-disable quotes */
import { cn } from '@/shared/lib';

import {
  FormControl,
  FormDescription,
  FormItem as FItem,
  FormLabel,
  FormMessage,
} from './form';

interface FormItemProps {
  label?: string;
  labelClassName?: string;
  labelElement?: React.JSX.Element;
  description?: string;
  className?: string;
  children?: React.JSX.Element;
  errorMessage?: string;
  errorClassName?: string;
  required?: boolean;
  disableErrorMessage?: boolean;
}

export const FormItem = ({
  label,
  labelClassName,
  labelElement,
  description,
  className,
  children,
  errorMessage,
  errorClassName,
  disableErrorMessage,
  required,
}: FormItemProps) => {
  return (
    <FItem className={cn('flex flex-col', className)}>
      {label && (
        <FormLabel
          className={cn(
            labelClassName,
            required && "after:ml-1 after:text-red-500 after:content-['*']",
          )}
        >
          {label}
        </FormLabel>
      )}
      {labelElement && !label && <FormLabel>{labelElement}</FormLabel>}
      <FormControl>{children}</FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      {!disableErrorMessage && (
        <FormMessage
          customErrorMessage={errorMessage}
          className={errorClassName}
        />
      )}
    </FItem>
  );
};
