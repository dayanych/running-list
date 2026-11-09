import { Link } from 'react-router-dom';

import { usePageMeta } from '@/shared/lib';
import { Button, StatusScreen, statusScreenActionClassName } from '@/shared/ui';

export const NotFoundPage = () => {
  usePageMeta({ title: 'Page not found | Running List', noindex: true });

  return (
    <StatusScreen
      marker="missing"
      title="Page not found"
      description="This address doesn't lead anywhere. Check the link or go to the current week"
      actions={
        <Button asChild className={statusScreenActionClassName}>
          <Link to="/">Open this week</Link>
        </Button>
      }
    />
  );
};
