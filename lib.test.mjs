import test from 'node:test';
import assert from 'node:assert/strict';
import { clean, key, tally, byPerson, summaryText, newRoom, roundOf, inRound, roundNumbers, MAX_LEN } from './lib.js';

const o = (label, byName, round) => ({ id: Math.random().toString(36), label, byName, ...(round ? { round } : {}) });

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
  assert.equal(
    summaryText(room),
    'Room 7K2HF\n\nRound 1 (current)\n2 x 12\n1 x Tuna\n- ana: 2x 12\n- bo: 1x Tuna',
  );
});

test('orders with no round number count as round 1 (old snapshots)', () => {
  assert.equal(roundOf({ label: '12' }), 1);
  assert.equal(roundOf({ label: '12', round: 3 }), 3);
});

test('rounds partition the order list without losing or duplicating plates', () => {
  const orders = [o('12', 'ana', 1), o('tuna', 'bo', 2), o('12', 'bo', 2), o('8', 'ana')];
  assert.deepEqual(roundNumbers(orders), [1, 2]);
  assert.equal(inRound(orders, 1).length, 2);
  assert.equal(inRound(orders, 2).length, 2);
  assert.equal(inRound(orders, 1).length + inRound(orders, 2).length, orders.length);
  assert.deepEqual(inRound(orders, 9), []);
});

test('summaryText lists the newest round first and marks the current one', () => {
  const room = {
    ...newRoom('7K2HF'),
    round: 2,
    orders: [o('12', 'ana', 1), o('tuna', 'bo', 2)],
  };
  const text = summaryText(room);
  assert.ok(text.indexOf('Round 2 (current)') < text.indexOf('Round 1'), 'newest first');
  assert.ok(!text.includes('Round 1 (current)'));
  assert.match(text, /Round 2 \(current\)\n1 x tuna\n- bo: 1x tuna/);
});

test('advancing the round does not change the tallies of earlier ones', () => {
  const orders = [o('12', 'ana', 1), o('12', 'ana', 1)];
  const before = tally(inRound(orders, 1));
  const room = { ...newRoom('X'), round: 2, orders };
  assert.deepEqual(tally(inRound(room.orders, 1)), before);
  assert.deepEqual(tally(inRound(room.orders, 2)), []);
});

test('empty room does not crash', () => {
  assert.deepEqual(tally([]), []);
  assert.deepEqual(byPerson([]), []);
  assert.equal(summaryText(newRoom('AAAAA')), 'Room AAAAA');
});
