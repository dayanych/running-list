import assert from 'node:assert/strict';
import test from 'node:test';

import type { StateStatus } from '@/entities/states/model/constants/state-status';
import type { State } from '@/entities/states/model/types/state.type';
import type { TaskWithStates } from '@/entities/tasks/model/types/task.type';

import { removeStateFromTasks } from './remove-state-from-tasks.ts';

/**
 * Builds a state fixture for a task
 *
 * @param id - State identifier
 * @param taskId - Task that owns the state
 * @returns State fixture
 */
const createState = (id: string, taskId: string): State => ({
  id,
  taskId,
  userId: 'user-1',
  date: new Date('2026-09-14T00:00:00'),
  status: 1 as StateStatus,
});

/**
 * Builds a task fixture with its states
 *
 * @param id - Task identifier
 * @param states - States owned by the task
 * @returns Task fixture
 */
const createTask = (id: string, states: State[]): TaskWithStates => ({
  id,
  title: id,
  userId: 'user-1',
  week: 38,
  year: 2026,
  color: 'blue',
  order: 0,
  createdAt: new Date('2026-09-14T00:00:00'),
  states,
});

test('removes only the requested state from the requested task', () => {
  const tasks = [
    createTask('task-1', [
      createState('state-1', 'task-1'),
      createState('state-2', 'task-1'),
    ]),
    createTask('task-2', [createState('state-3', 'task-2')]),
  ];

  const result = removeStateFromTasks(tasks, 'task-1', 'state-2');

  assert.deepEqual(
    result?.[0].states.map(({ id }) => id),
    ['state-1'],
  );
  assert.deepEqual(
    result?.[1].states.map(({ id }) => id),
    ['state-3'],
  );
});

test('preserves an empty cache', () => {
  assert.equal(removeStateFromTasks(undefined, 'task-1', 'state-1'), undefined);
});
