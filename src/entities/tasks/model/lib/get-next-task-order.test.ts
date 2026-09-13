import assert from 'node:assert/strict';
import test from 'node:test';

import { getNextTaskOrder } from './get-next-task-order.ts';

test('returns zero for the first task in a week', () => {
  assert.equal(getNextTaskOrder([]), 0);
});

test('returns one more than the greatest existing order', () => {
  assert.equal(getNextTaskOrder([{ order: 3 }, { order: 1 }]), 4);
});
