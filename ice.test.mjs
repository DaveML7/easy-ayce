import test from 'node:test';
import assert from 'node:assert/strict';
import { iceServers, turnEnabled } from './ice.js';

test('STUN alone when no TURN is configured', () => {
  const list = iceServers(null);
  assert.equal(list.length, 1);
  assert.match(String(list[0].urls), /^stun:/);
  assert.equal(turnEnabled(null), false);
});

test('TURN is appended with its credentials when configured', () => {
  const turn = { urls: ['turn:a.relay.metered.ca:80'], username: 'u', credential: 'c' };
  const list = iceServers(turn);
  assert.equal(list.length, 2);
  assert.deepEqual(list[1], { urls: turn.urls, username: 'u', credential: 'c' });
  assert.equal(turnEnabled(turn), true);
});

test('a half-filled TURN block is ignored rather than shipped broken', () => {
  assert.equal(iceServers({ urls: ['turn:x:3478'] }).length, 1);
  assert.equal(iceServers({ urls: [], username: 'u', credential: 'c' }).length, 1);
  assert.equal(iceServers({ urls: ['turn:x:3478'], username: '', credential: 'c' }).length, 1);
});
