import { Button } from '@/shared/ui/shadcn/button';
import {
  StatusScreen,
  statusScreenActionClassName,
} from '@/shared/ui/status-screen';

/** Renders the full-screen temporary unavailability message */
export const UnavailablePage = () => {
  return (
    <StatusScreen
      marker="paused"
      title="Running List is temporarily unavailable"
      description="We’ve paused access for a little while. Your lists are still here. Please try again later"
      actions={
        <Button asChild className={statusScreenActionClassName}>
          <a href="/">Try again</a>
        </Button>
      }
    />
  );
};
