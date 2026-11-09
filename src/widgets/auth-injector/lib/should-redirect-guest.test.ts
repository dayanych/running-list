import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldRedirectGuest } from './should-redirect-guest.ts';

test('keeps a guest on the home page', () => {
  assert.equal(shouldRedirectGuest('/', false), false);
});

test('redirects a guest away from the settings page', () => {
  assert.equal(shouldRedirectGuest('/settings', false), true);
});

test('redirects a guest away from a week page', () => {
  assert.equal(shouldRedirectGuest('/2026/45', false), true);
});

test('keeps a signed-in user on a protected page', () => {
  assert.equal(shouldRedirectGuest('/settings', true), false);
});
