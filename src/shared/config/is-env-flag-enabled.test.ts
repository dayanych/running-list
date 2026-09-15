import assert from 'node:assert/strict';
import test from 'node:test';

import { isEnvFlagEnabled } from './is-env-flag-enabled.ts';

test('enables an environment flag only for the exact value "true"', () => {
  assert.equal(isEnvFlagEnabled('true'), true);
  assert.equal(isEnvFlagEnabled('false'), false);
  assert.equal(isEnvFlagEnabled('TRUE'), false);
  assert.equal(isEnvFlagEnabled(undefined), false);
});
