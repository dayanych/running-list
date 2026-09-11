import { useWeekPage } from '../lib/use-week-page';
import { CreateTaskInput, TasksTable, WeekTitle } from './';

export const WeekPage = () => {
  const {
    startWeekDate,
    tasksWithStates,
    isLoading,
    isError,
    taskInputRef,
    handleWeekChange,
    handleCreateTaskClick,
  } = useWeekPage();

  return (
    <div className="container relative mb-3 mt-10 flex flex-1 flex-col justify-between gap-4 sm:mt-14">
      <div className="flex flex-col gap-4">
        <WeekTitle startWeekDate={startWeekDate} onChange={handleWeekChange} />
        <TasksTable
          data={tasksWithStates ?? []}
          startWeekDate={startWeekDate}
          loading={isLoading}
          error={isError}
          onCreateTaskClick={handleCreateTaskClick}
        />
      </div>
      <CreateTaskInput ref={taskInputRef} />
    </div>
  );
};
