import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToast,
} from '../shadcn';

/**
 * The eyebrow label is derived from the variant rather than supplied by the
 * caller, so every notification reads in the same voice
 */
const VARIANT_LABEL = {
  default: 'Notice',
  success: 'Done',
  error: 'Error',
} as const;

export const Toaster = () => {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="up">
      {toasts.map(({ id, description, variant, ...props }) => (
        <Toast key={id} variant={variant} {...props}>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <ToastTitle>{VARIANT_LABEL[variant || 'default']}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </div>
          {variant === 'error' && <ToastClose />}
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
};
