# easy ayce

Shared plate counter for all-you-can-eat sushi tables that still take orders on paper.

Someone opens a room, shows a QR code, everyone at the table joins with just a name and
taps the plate IDs they want. Every device sees the same tally, with who ordered what,
and there is a big readable view to hand to the waiter. Orders are grouped in **rounds**,
the way AYCE places actually take them.

## What it is (and isn't)

- **Static site.** Three files, no build step, no `npm install` for the app itself.
- **No backend, no database.** Rooms live in the phones. A free public WebRTC broker
  (`0.peerjs.com`) is used only to let the phones find each other — no room data is
  stored anywhere.
- Rooms are ephemeral on purpose: nothing is written down after the meal.

## Deploy on GitHub Pages

1. Push `index.html`, `lib.js`, `ice.js` to a repo.
2. Repo → Settings → Pages → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. Open `https://<you>.github.io/<repo>/`.

HTTPS is required for WebRTC; GitHub Pages gives you that for free.

## Local run

```sh
python3 -m http.server 8787     # then open http://localhost:8787
```

`file://` will not work — ES modules and WebRTC need a real origin.

## Tests

```sh
npm test        # node --test lib.test.mjs, no dependencies
```

Covers the pure logic in `lib.js` (grouping keys, tallies, per-person totals, summary text).

## TURN (two phones on different mobile carriers)

Already configured: `ice.js` carries an ExpressTURN free-tier credential, so the relay
works out of the box. Same Wi-Fi will still go direct — TURN is only used when a direct
path is impossible, which is the usual case when the phones are on different carriers.

**Check it worked:** the status line under the room code ends in `· direct` or `· relay`.
Put one phone on Wi-Fi and one on mobile data, join the same room, and look at the line.
`· relay` means TURN carried it; `· direct` means it was not needed. If the phones never
connect at all, the credential has expired or been mistyped.

To use another provider, replace the `TURN` block in `ice.js` — nothing else references
it. Alternatives with free tiers:

- [Metered](https://www.metered.ca/tools/openrelay/) — `turn:a.relay.metered.ca:80`
- [ExpressTURN](https://www.expressturn.com/) — `turn:free.expressturn.com:3478`

There is no free TURN without a signup: the widely-copied `openrelay` static credentials
and `numb.viagenie.ca` are both dead. TURN needs an account because it pays for the
bandwidth.

**A repo on GitHub Pages is public**, so this credential is readable by anyone. Free
tiers reset monthly; rotate it in the provider dashboard if it gets abused. If you would
rather not publish it, set `TURN = null` and accept Wi-Fi-only reliability.

A wrong password fails silently — no relay candidates, no error, exactly like having no
TURN at all — which is why the status line reports the route.

## Rounds

A room starts on round 1. Everyone keeps adding plates to the round that is open; when
the food is on its way, anyone taps **Start round N+1** and the table starts a fresh
list. The old round is locked and folded away under "1 earlier round", so you can still
see what you have already had without it cluttering the order you are placing now.

- The waiter view shows the current round first, then an "already ordered" recap.
- Copy includes every round, newest first — handy for pasting in a group chat.
- Undo only reaches back into the round you are ordering; earlier rounds are history.
- A round cannot be started until something is in the current one, so no empty rounds.

Not implemented, because nothing in the app can enforce it: per-round plate caps, or a
maximum number of rounds. Those stay a rule of the restaurant.

## How a room stays in sync

One device hosts the room (its peer id is derived from the room code); everyone else
connects to it and the host is the only writer. Clients send intents, the host
broadcasts the whole state. It is small enough that full-state broadcasts are free.

- **Host leaves or its tab dies** → the remaining phones notice the room went silent
  (heartbeat) and one of them claims the room id, keeping the order it already had.
- **A tap while the link is down** → the plate is shown immediately, marked unsent, and
  merged by order id when the room answers. A dead-looking link cannot swallow a tap.
- **The host reloads** → a 6-hour local snapshot on the host restores the table.

## Known limits

- **Different mobile carriers.** Handled by the TURN credential in `ice.js` — see above.
  If that credential expires, those phones cannot connect; same Wi-Fi always works.
- **The public broker is best-effort.** `0.peerjs.com` is free and shared. If it dies,
  the app stops syncing (it still works locally) — self-host
  [`peerjs-server`](https://github.com/peers/peerjs-server) and pass `host`/`port` in
  `makePeer`.
- **No auth.** Anyone who knows the 5-character code can order. Fine for a dinner table.
- **Nothing persists** beyond the host snapshot. Closing every tab ends the order.
- **Ceiling of 400 orders per room** (`MAX_ORDERS`) so a state broadcast stays small.
- Two people may pick the same name; orders are still tracked separately per device.

## Files

| file | role |
| --- | --- |
| `index.html` | UI, styles and all app logic |
| `ice.js` | STUN/TURN configuration (the one file you edit for TURN) |
| `lib.js` | pure tally/summary logic (imported by the page and the test) |
| `*.test.mjs` | unit tests, no dependencies |
