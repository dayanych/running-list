import assert from 'node:assert/strict';
import test from 'node:test';

import { getCanonicalUrl } from './get-canonical-url.ts';

const appUrl = 'https://runninglist.app';

test('joins the app URL and the page path', () => {
  assert.equal(getCanonicalUrl(appUrl, '/guide'), `${appUrl}/guide`);
});

test('keeps a single slash for the home page', () => {
  assert.equal(getCanonicalUrl(appUrl, '/'), `${appUrl}/`);
});

test('ignores a trailing slash in the app URL', () => {
  assert.equal(getCanonicalUrl(`${appUrl}/`, '/guide'), `${appUrl}/guide`);
});

test('removes a trailing slash from the page path', () => {
  assert.equal(getCanonicalUrl(appUrl, '/guide/'), `${appUrl}/guide`);
});

test('returns null without an app URL', () => {
  assert.equal(getCanonicalUrl('', '/guide'), null);
});
