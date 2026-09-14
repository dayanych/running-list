import { Link } from 'react-router-dom';

import { Button, StatusScreen, statusScreenActionClassName } from '@/shared/ui';

export const NotFoundPage = () => {
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
