import {
  dehydrate,
  HydrationBoundary,
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.options.onError) return;

            toast.error(`${error.message}. Try again later`);
          },
          onSuccess: () => toast.success('Successfully'),
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReactQueryDevtools initialIsOpen={false} />
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
  );
};
