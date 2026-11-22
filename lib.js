// Pure logic, no DOM. Shared by index.html and lib.test.mjs.

export const MAX_LEN = 40;
export const MAX_ORDERS = 400;

export const clean = (s) =>
  String(s ?? '').trim().replace(/\s+/g, ' ').slice(0, MAX_LEN);

// grouping key: case- and space-insensitive so "12" and " 12 " are one plate
export const key = (s) => clean(s).toLowerCase();

export const uid = () => Math.random().toString(36).slice(2, 9);

export const newRoom = (code) => ({ code, round: 1, orders: [], people: {}, closed: false });

// AYCE places take orders in rounds. Every order carries the round it was placed
// in; orders from before rounds existed have no number and count as round 1.
export const roundOf = (order) => order.round || 1;
export const inRound = (orders, n) => orders.filter((o) => roundOf(o) === n);
export const roundNumbers = (orders) => [...new Set(orders.map(roundOf))].sort((a, b) => a - b);

// One entry per distinct plate, busiest first. First spelling seen wins as the label.
export function tally(orders) {
  const groups = new Map();
  for (const o of orders) {
    const k = key(o.label);
    if (!k) continue;
    let g = groups.get(k);
    if (!g) {
      g = { key: k, label: clean(o.label), total: 0, who: new Map() };
      groups.set(k, g);
    }
    g.total++;
    const name = o.byName || '?';
    g.who.set(name, (g.who.get(name) || 0) + 1);
  }
  return [...groups.values()]
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))
    .map((g) => ({ key: g.key, label: g.label, total: g.total, who: [...g.who].map(([name, n]) => ({ name, n })) }));
}

// One entry per person, busiest first.
export function byPerson(orders) {
  const people = new Map();
  for (const o of orders) {
    const k = key(o.label);
    if (!k) continue;
    const name = o.byName || '?';
    let p = people.get(name);
    if (!p) {
      p = { name, total: 0, items: new Map() };
      people.set(name, p);
    }
    p.total++;
    const item = p.items.get(k);
    if (item) item.n++;
    else p.items.set(k, { label: clean(o.label), n: 1 });
  }
  return [...people.values()]
    .sort((a, b) => b.total - a.total)
    .map((p) => ({ name: p.name, total: p.total, items: [...p.items.values()].sort((a, b) => b.n - a.n) }));
}

// Plain text, for pasting into a chat or reading out to the waiter.
// Newest round first, each with what to bring and who asked for it.
export function summaryText(room, labels = { room: 'Room', round: 'Round', current: '(current)' }) {
  const cur = room.round || 1;
  const rounds = roundNumbers(room.orders).reverse();
  if (!rounds.length) return `${labels.room} ${room.code}`;
  const blocks = rounds.map((n) => {
    const items = inRound(room.orders, n);
    const plates = tally(items).map((g) => `${g.total} x ${g.label}`).join('\n');
    const people = byPerson(items)
      .map((p) => `- ${p.name}: ${p.items.map((i) => `${i.n}x ${i.label}`).join(', ')}`)
      .join('\n');
    return [`${labels.round} ${n}${n === cur ? ' ' + labels.current : ''}`, plates, people].filter(Boolean).join('\n');
  });
  return [`${labels.room} ${room.code}`, ...blocks].join('\n\n');
}
