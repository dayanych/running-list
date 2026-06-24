import { Link } from 'react-router-dom';

import { appConfig } from '@/shared/config';
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/ui';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyTitle
            className="text-9xl font-bold tracking-normal"
            role="heading"
            aria-level={1}
          >
            404
          </EmptyTitle>
          <EmptyDescription>
            Sorry, the page you&apos;re looking for doesn&apos;t exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
        </EmptyContent>
        <EmptyDescription>
          Need help?{' '}
          <a href={`mailto:${appConfig.supportEmail}`}>Contact support</a>
        </EmptyDescription>
      </Empty>
    </div>
  );
};
