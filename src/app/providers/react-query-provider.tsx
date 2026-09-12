import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

import { notify } from '@/shared/ui/toaster/notify';

const FIVE_MINUTES = 5 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

/**
 * Week data only changes through the user's own mutations, which write straight
 * into the cache via `setQueryData`. Refetching on every window focus or remount
 * costs Firestore reads without ever producing new data, so both are disabled and
 * the data is kept fresh for a window long enough to cover normal navigation
 */
const queryDefaultOptions = {
  staleTime: FIVE_MINUTES,
  gcTime: THIRTY_MINUTES,
  refetchOnWindowFocus: false,
  retry: 1,
};

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: queryDefaultOptions,
        },
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.options.onError) return;

            notify.error(`${error.message}. Try again later`);
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
};
