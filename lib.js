// Pure logic, no DOM. Shared by index.html and lib.test.mjs.

export const MAX_LEN = 40;
export const MAX_ORDERS = 400;

export const clean = (s) =>
  String(s ?? '').trim().replace(/\s+/g, ' ').slice(0, MAX_LEN);

// grouping key: case- and space-insensitive so "12" and " 12 " are one plate
export const key = (s) => clean(s).toLowerCase();

export const uid = () => Math.random().toString(36).slice(2, 9);

export const newRoom = (code) => ({ code, orders: [], people: {}, closed: false });

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
export function summaryText(room) {
  const plates = tally(room.orders).map((g) => `${g.total} x ${g.label}`).join('\n');
  const people = byPerson(room.orders)
    .map((p) => `${p.name}: ${p.items.map((i) => `${i.n}x ${i.label}`).join(', ')}`)
    .join('\n');
  return [`Room ${room.code}`, plates, people].filter((s) => s).join('\n\n');
}
