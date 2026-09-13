import { useWeekPage } from '../lib/use-week-page';
import { CreateTaskInput, TasksTable, WeekTitle } from './';

export const WeekPage = () => {
  const {
    startWeekDate,
    tasksWithStates,
    isTaskLimitReached,
    isLoading,
    isError,
    taskInputRef,
    handleWeekChange,
    transitionDirection,
  } = useWeekPage();

  return (
    <div className="container relative mb-3 mt-10 flex flex-1 flex-col justify-between gap-4 sm:mt-14">
      <div className="flex flex-col gap-12 sm:gap-16">
        <WeekTitle
          startWeekDate={startWeekDate}
          transitionDirection={transitionDirection}
          onChange={handleWeekChange}
        />
        <TasksTable
          key={startWeekDate.getTime()}
          data={tasksWithStates ?? []}
          startWeekDate={startWeekDate}
          transitionDirection={transitionDirection}
          loading={isLoading}
          error={isError}
        />
      </div>
      <CreateTaskInput
        ref={taskInputRef}
        isTaskLimitReached={isTaskLimitReached}
      />
    </div>
  );
};
