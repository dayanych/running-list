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
    <div className="container relative my-3 flex h-full flex-col justify-between gap-4">
      <div className="flex flex-col gap-4">
        <WeekTitle startWeekDate={startWeekDate} onChange={handleWeekChange} />
        <TasksTable
          data={tasksWithStates ?? []}
          startWeekDate={startWeekDate}
          loading={isLoading}
          error={isError}
        />
      </div>
      <CreateTaskInput />
    </div>
  );
};
