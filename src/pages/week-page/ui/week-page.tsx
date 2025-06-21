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
    <div className="container flex flex-col gap-4">
      <WeekTitle startWeekDate={startWeekDate} onChange={handleWeekChange} />
      <CreateTaskInput />
      <TasksTable
        data={tasksWithStates ?? []}
        startWeekDate={startWeekDate}
        loading={isLoading}
        error={isError}
      />
    </div>
  );
};
