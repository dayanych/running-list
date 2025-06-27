import { useWeekPage } from '../lib/use-week-page';
import { CreateTaskInput, TasksTable, WeekTitle } from './';

export const WeekPage = () => {
  const {
    startWeekDate,
    tasksWithStates,
    isLoading,
    isError,
    handleWeekChange,
  } = useWeekPage();

  return (
    <div className="container relative my-3 flex h-dvh flex-col gap-4 pb-14">
      <WeekTitle startWeekDate={startWeekDate} onChange={handleWeekChange} />
      <TasksTable
        data={tasksWithStates ?? []}
        startWeekDate={startWeekDate}
        loading={isLoading}
        error={isError}
      />
      {/* left-8 - because of the padding-left of the container */}
      <div className="absolute bottom-0 left-8 right-0">
        <CreateTaskInput />
      </div>
    </div>
  );
};
