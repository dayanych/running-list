import assert from 'node:assert/strict';
import test from 'node:test';

import { migrateTaskOrder } from './task-order.mjs';

const task = ({
  id,
  userId = 'user-1',
  year = 2026,
  week = 10,
  createdAt,
  order,
}) => ({
  name: `projects/running-list-c1ded/databases/(default)/documents/tasks/${id}`,
  fields: {
    user_id: { stringValue: userId },
    year: { integerValue: String(year) },
    week: { integerValue: String(week) },
    created_at: { timestampValue: createdAt },
    ...(order === undefined ? {} : { order: { integerValue: String(order) } }),
  },
  updateTime: `2026-01-01T00:00:0${id.length}Z`,
});

const indexFields = [
  { fieldPath: 'user_id', order: 'ASCENDING' },
  { fieldPath: 'year', order: 'ASCENDING' },
  { fieldPath: 'week', order: 'ASCENDING' },
  { fieldPath: 'order', order: 'ASCENDING' },
];

const createRequest = (documents, initialIndex = 'READY') => {
  const patches = [];
  const createdIndexes = [];
  let index = initialIndex;

  const request = async (route, options = {}) => {
    if (route.includes('/collectionGroups/tasks/indexes')) {
      if (options.method === 'POST') {
        const body = JSON.parse(options.body);
        createdIndexes.push(body);
        index = 'READY';
        return { state: index, ...body };
      }

      return {
        indexes:
          index === 'MISSING'
            ? []
            : [{ queryScope: 'COLLECTION', fields: indexFields, state: index }],
      };
    }

    if (options.method !== 'PATCH') {
      return { documents };
    }

    const documentName = route.split('?')[0];
    const document = documents.find(({ name }) => name === documentName);
    const body = JSON.parse(options.body);

    document.fields.order = body.fields.order;
    patches.push({ route, body });

    return document;
  };

  return { request, patches, createdIndexes };
};

test('assigns legacy tasks a zero-based order within each week', async () => {
  const documents = [
    task({ id: 'later', createdAt: '2026-03-03T10:00:00Z' }),
    task({ id: 'earlier', createdAt: '2026-03-02T10:00:00Z' }),
    task({
      id: 'other-week',
      week: 11,
      createdAt: '2026-03-04T10:00:00Z',
    }),
  ];
  const { request, patches } = createRequest(documents);

  const result = await migrateTaskOrder({
    request,
    projectId: 'running-list-c1ded',
    apply: true,
  });

  assert.deepEqual(
    patches.map(({ route, body }) => ({
      id: route.split('/').pop().split('?')[0],
      order: body.fields.order.integerValue,
    })),
    [
      { id: 'earlier', order: '0' },
      { id: 'later', order: '1' },
      { id: 'other-week', order: '0' },
    ],
  );
  assert.deepEqual(result, {
    total: 3,
    missing: 0,
    updated: 3,
    index: 'READY',
  });
});

test('preserves existing orders and appends only missing tasks', async () => {
  const documents = [
    task({ id: 'ordered', createdAt: '2026-03-03T10:00:00Z', order: 4 }),
    task({ id: 'legacy', createdAt: '2026-03-02T10:00:00Z' }),
  ];
  const { request, patches } = createRequest(documents);

  const result = await migrateTaskOrder({
    request,
    projectId: 'running-list-c1ded',
    apply: true,
  });

  assert.equal(documents[0].fields.order.integerValue, '4');
  assert.equal(documents[1].fields.order.integerValue, '5');
  assert.equal(patches.length, 1);
  assert.deepEqual(result, {
    total: 2,
    missing: 0,
    updated: 1,
    index: 'READY',
  });
});

test('dry run reports missing orders without writing', async () => {
  const documents = [task({ id: 'legacy', createdAt: '2026-03-02T10:00:00Z' })];
  const { request, patches } = createRequest(documents, 'MISSING');

  const result = await migrateTaskOrder({
    request,
    projectId: 'running-list-c1ded',
  });

  assert.deepEqual(result, {
    total: 1,
    missing: 1,
    updated: 0,
    index: 'MISSING',
  });
  assert.equal(patches.length, 0);
});

test('creates the query index without rewriting already migrated tasks', async () => {
  const documents = [
    task({
      id: 'ordered',
      createdAt: '2026-03-02T10:00:00Z',
      order: 0,
    }),
  ];
  const { request, patches, createdIndexes } = createRequest(
    documents,
    'MISSING',
  );

  const result = await migrateTaskOrder({
    request,
    projectId: 'running-list-c1ded',
    apply: true,
    wait: async () => {},
  });

  assert.equal(patches.length, 0);
  assert.deepEqual(createdIndexes, [
    { queryScope: 'COLLECTION', fields: indexFields },
  ]);
  assert.deepEqual(result, {
    total: 1,
    missing: 0,
    updated: 0,
    index: 'READY',
  });
});
