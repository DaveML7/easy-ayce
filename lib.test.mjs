import test from 'node:test';
import assert from 'node:assert/strict';
import { clean, key, tally, byPerson, summaryText, newRoom, MAX_LEN } from './lib.js';

const o = (label, byName) => ({ id: Math.random().toString(36), label, byName });

test('clean trims, collapses spaces and caps length', () => {
  assert.equal(clean('  12  salmon '), '12 salmon');
  assert.equal(clean(null), '');
  assert.equal(clean('x'.repeat(200)).length, MAX_LEN);
});

test('key ignores case and spacing so the same plate groups once', () => {
  assert.equal(key(' Salmon '), key('salmon'));
  assert.equal(key('12'), key('  12  '));
  assert.notEqual(key('12'), key('21'));
});

test('tally counts, keeps the first label spelling, and lists who', () => {
  const t = tally([o('Salmon', 'ana'), o('salmon', 'bo'), o('Tuna', 'ana'), o('  ', 'x')]);
  assert.equal(t.length, 2);
  const salmon = t.find((g) => g.key === 'salmon');
  assert.equal(salmon.label, 'Salmon');
  assert.equal(salmon.total, 2);
  assert.deepEqual(salmon.who, [{ name: 'ana', n: 1 }, { name: 'bo', n: 1 }]);
  assert.equal(t[0].key, 'salmon', 'busiest plate first');
});

test('byPerson groups each order under its owner', () => {
  const p = byPerson([o('12', 'ana'), o('12', 'ana'), o('Tuna', 'bo')]);
  assert.deepEqual(p.map((x) => [x.name, x.total]), [['ana', 2], ['bo', 1]]);
  assert.deepEqual(p[0].items, [{ label: '12', n: 2 }]);
});

test('totals agree: sum of tally === sum of byPerson === order count', () => {
  const orders = [o('12', 'a'), o('24', 'b'), o('12', 'a'), o('8', 'c'), o('12', 'c')];
  const sum = (xs) => xs.reduce((n, x) => n + x.total, 0);
  assert.equal(sum(tally(orders)), orders.length);
  assert.equal(sum(byPerson(orders)), orders.length);
});

test('summaryText is stable and readable', () => {
  const room = { ...newRoom('7K2HF'), orders: [o('12', 'ana'), o('12', 'ana'), o('Tuna', 'bo')] };
  assert.equal(summaryText(room), 'Room 7K2HF\n\n2 x 12\n1 x Tuna\n\nana: 2x 12\nbo: 1x Tuna');
});

test('empty room does not crash', () => {
  assert.deepEqual(tally([]), []);
  assert.deepEqual(byPerson([]), []);
  assert.equal(summaryText(newRoom('AAAAA')), 'Room AAAAA');
});
