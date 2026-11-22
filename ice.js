// ICE servers for the WebRTC link between phones.
//
// STUN is free and needs no account; it is enough when the phones are on the
// same Wi-Fi or on carriers with friendly NAT.
//
// TURN relays the traffic when a direct connection is impossible (typically two
// phones on different mobile carriers). It costs bandwidth, so every provider
// wants an account. Paste free-tier credentials below and TURN switches on.
//
//   Metered     https://www.metered.ca/tools/openrelay/   (free tier)
//     urls: ['turn:a.relay.metered.ca:80', 'turn:a.relay.metered.ca:443?transport=tcp']
//   ExpressTURN https://www.expressturn.com/              (free tier)
//     urls: ['turn:relay1.expressturn.com:3478']
//
// Then reload: the status line under the room code ends in "relay" once traffic
// goes through TURN, "direct" when it does not.
//
// NB: these values are public in a GitHub Pages repo. Use a free tier, not a
// paid key, and rotate it in the provider dashboard if it gets abused.
//
// Configured below: ExpressTURN free tier. Verified against the live server —
// both credentials together produce relay candidates (a wrong or half-right
// password silently yields none, which looks exactly like "TURN is off").
export const TURN = {
  urls: ['turn:free.expressturn.com:3478'],
  username: '000000002110745096',
  credential: '8gejq62dsRo07I1JNhLR/fuIq8s=',
};

// Passing a config replaces PeerJS's own default one, which points at
// turn:eu-0/us-0.turn.peerjs.com — those hostnames no longer resolve (checked),
// so nothing is lost by overriding it. Keep a STUN entry here regardless.
const STUN = ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'];

export function iceServers(turn = TURN) {
  const servers = [{ urls: STUN }];
  if (turn && turn.urls && turn.urls.length && turn.username) {
    servers.push({ urls: turn.urls, username: turn.username, credential: turn.credential });
  }
  return servers;
}

export const turnEnabled = (turn = TURN) => iceServers(turn).length > 1;
