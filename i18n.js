// All user-facing text, in English and Italian.
// Pure: no DOM. index.html reads it, the tests check both languages stay in step.

export const LANGS = ['en', 'it'];

const STRINGS = {
  en: {
    docTitle: 'easy ayce — shared sushi order',
    tagline: 'Shared plate counter for all-you-can-eat sushi. No signup — one room per table.',
    yourName: 'Your name',
    namePlaceholder: 'e.g. Marco',
    roomCode: 'Room code',
    join: 'Join',
    create: 'Create a table',

    guideTitle: 'How it works',
    guide1: 'Create a table, or open the link or QR code someone shares with you.',
    guide2: 'Everyone types a name and joins. No signup, nothing to install.',
    guide3: 'Tap a plate ID or type it. Tap a row to order one more of the same.',
    guide4: 'Show the Waiter tab to the staff, then start the next round.',

    share: 'Share',
    qr: 'QR',
    tabOrder: 'Order',
    tabWaiter: 'Waiter',
    platePlaceholder: 'Plate ID or name',
    addPlate: 'Add plate',
    tapHint: 'Tap any row to order one more.',
    undo: 'Undo my last',
    leave: 'Leave',
    copy: 'Copy',
    closeRoom: 'Close room',
    done: 'Done',
    qrAlt: 'QR code to join this room',

    statusHosting: 'hosting — you are the room',
    statusSynced: 'synced with the table',
    statusClosed: 'room closed',
    statusConnecting: 'connecting…',
    routeDirect: 'direct',
    routeRelay: 'relay',
    justYou: 'just you',

    roundN: 'Round {n}',
    startRound: 'Start round {n}',
    platesOne: '{n} plate',
    platesMany: '{n} plates',
    roundNothing: 'nothing yet',
    roundEmpty: 'Nothing in round {n} yet.',
    earlierOne: '{n} earlier round',
    earlierMany: '{n} earlier rounds',
    who: 'Who',
    alreadyOrdered: 'Already ordered',

    roomWord: 'Room',
    roundWord: 'Round',
    currentWord: '(current)',

    bannerClosed: 'This room is closed. Nobody can add to it anymore.',
    bannerUnsentOne: '{n} plate not sent to the table yet — kept on this phone and sent as soon as the room answers.',
    bannerUnsentMany: '{n} plates not sent to the table yet — kept on this phone and sent as soon as the room answers.',
    bannerNotSynced: 'Not synced yet. Anything you add is kept on this phone and sent when the room answers.',

    toastNameFirst: 'Your name first.',
    toastBadCode: 'Room code looks wrong.',
    toastClosed: 'This room is closed.',
    toastAlreadyClosed: 'Already closed.',
    toastNothingUndo: 'Nothing to undo.',
    toastLinkCopied: 'Link copied.',
    toastOrderCopied: 'Order copied.',
    toastCopyFailed: 'Copy failed.',
    toastNoConnection: 'No connection — try again in a moment.',
    toastNoConnectionClose: 'No connection — cannot close the room right now.',

    confirmStartRound: 'Start round {next}? Round {cur} stays visible but is locked.',
    confirmCloseRoom: 'Close this room for everyone? The list stays visible but nobody can add more.',
  },

  it: {
    docTitle: 'easy ayce — ordine sushi condiviso',
    tagline: 'Contatore condiviso dei piatti per sushi all you can eat. Nessuna registrazione — una stanza per tavolo.',
    yourName: 'Il tuo nome',
    namePlaceholder: 'es. Marco',
    roomCode: 'Codice stanza',
    join: 'Entra',
    create: 'Crea un tavolo',

    guideTitle: 'Come funziona',
    guide1: 'Crea un tavolo, oppure apri il link o il QR che ti condividono.',
    guide2: 'Ognuno scrive il proprio nome ed entra. Niente registrazione, niente da installare.',
    guide3: "Tocca l'ID del piatto o scrivilo. Tocca una riga per ordinarne un altro uguale.",
    guide4: 'Mostra la scheda Cameriere al personale, poi inizia il turno successivo.',

    share: 'Condividi',
    qr: 'QR',
    tabOrder: 'Ordine',
    tabWaiter: 'Cameriere',
    platePlaceholder: 'ID o nome del piatto',
    addPlate: 'Aggiungi piatto',
    tapHint: 'Tocca una riga per ordinarne un altro.',
    undo: 'Annulla ultimo',
    leave: 'Esci',
    copy: 'Copia',
    closeRoom: 'Chiudi stanza',
    done: 'Fatto',
    qrAlt: 'Codice QR per entrare in questa stanza',

    statusHosting: 'stai ospitando la stanza',
    statusSynced: 'sincronizzato con il tavolo',
    statusClosed: 'stanza chiusa',
    statusConnecting: 'connessione…',
    routeDirect: 'diretto',
    routeRelay: 'relay',
    justYou: 'solo tu',

    roundN: 'Turno {n}',
    startRound: 'Inizia turno {n}',
    platesOne: '{n} piatto',
    platesMany: '{n} piatti',
    roundNothing: 'ancora niente',
    roundEmpty: 'Ancora niente nel turno {n}.',
    earlierOne: '{n} turno precedente',
    earlierMany: '{n} turni precedenti',
    who: 'Chi',
    alreadyOrdered: 'Già ordinato',

    roomWord: 'Stanza',
    roundWord: 'Turno',
    currentWord: '(attuale)',

    bannerClosed: 'Questa stanza è chiusa. Nessuno può più aggiungere piatti.',
    bannerUnsentOne: '{n} piatto non ancora inviato al tavolo — resta su questo telefono e parte appena la stanza risponde.',
    bannerUnsentMany: '{n} piatti non ancora inviati al tavolo — restano su questo telefono e partono appena la stanza risponde.',
    bannerNotSynced: 'Non ancora sincronizzato. Quello che aggiungi resta su questo telefono e viene inviato quando la stanza risponde.',

    toastNameFirst: 'Prima scrivi il tuo nome.',
    toastBadCode: 'Il codice stanza non sembra giusto.',
    toastClosed: 'Questa stanza è chiusa.',
    toastAlreadyClosed: 'È già chiusa.',
    toastNothingUndo: 'Niente da annullare.',
    toastLinkCopied: 'Link copiato.',
    toastOrderCopied: 'Ordine copiato.',
    toastCopyFailed: 'Copia non riuscita.',
    toastNoConnection: 'Nessuna connessione — riprova tra un attimo.',
    toastNoConnectionClose: 'Nessuna connessione — non posso chiudere la stanza adesso.',

    confirmStartRound: 'Inizio turno {next}? Il turno {cur} resta visibile ma viene bloccato.',
    confirmCloseRoom: 'Chiudere la stanza per tutti? La lista resta visibile ma nessuno può più aggiungere.',
  },
};

export { STRINGS };

// A saved choice wins; otherwise Italian browsers get Italian, everything else English.
export function pickLang(saved, navLang) {
  if (LANGS.includes(saved)) return saved;
  return String(navLang || '').toLowerCase().startsWith('it') ? 'it' : 'en';
}

export function t(lang, key, vars) {
  const dict = STRINGS[lang] || STRINGS.en;
  let text = dict[key] ?? STRINGS.en[key] ?? key;
  if (vars) for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, String(value));
  return text;
}

// One/two forms keyed by count, since "1 piatto" and "2 piatti" differ.
export function tCount(lang, n, oneKey, manyKey) {
  return t(lang, n === 1 ? oneKey : manyKey, { n });
}
