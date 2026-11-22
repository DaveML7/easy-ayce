import test from 'node:test';
import assert from 'node:assert/strict';
import { STRINGS, LANGS, pickLang, t, tCount } from './i18n.js';

const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

test('both languages define exactly the same keys', () => {
  const en = Object.keys(STRINGS.en).sort();
  for (const lang of LANGS) assert.deepEqual(Object.keys(STRINGS[lang]).sort(), en, `keys differ for ${lang}`);
});

test('no translation is empty and placeholders match the english text', () => {
  for (const key of Object.keys(STRINGS.en)) {
    assert.ok(STRINGS.en[key].trim(), `empty en:${key}`);
    for (const lang of LANGS) {
      assert.ok(STRINGS[lang][key].trim(), `empty ${lang}:${key}`);
      assert.deepEqual(placeholders(STRINGS[lang][key]), placeholders(STRINGS.en[key]), `placeholder mismatch in ${lang}:${key}`);
    }
  }
});

test('t interpolates named values', () => {
  assert.equal(t('en', 'roundN', { n: 3 }), 'Round 3');
  assert.equal(t('it', 'roundN', { n: 3 }), 'Turno 3');
  assert.equal(t('en', 'confirmStartRound', { next: 2, cur: 1 }), 'Start round 2? Round 1 stays visible but is locked.');
  assert.equal(t('it', 'confirmStartRound', { next: 2, cur: 1 }), 'Inizio turno 2? Il turno 1 resta visibile ma viene bloccato.');
});

test('unknown keys and languages degrade instead of throwing', () => {
  assert.equal(t('en', 'nope'), 'nope');
  assert.equal(t('de', 'join'), 'Join', 'unsupported language falls back to english');
  assert.equal(t('it', 'nope'), 'nope');
});

test('tCount picks the singular only for exactly one', () => {
  assert.equal(tCount('en', 1, 'platesOne', 'platesMany'), '1 plate');
  assert.equal(tCount('en', 2, 'platesOne', 'platesMany'), '2 plates');
  assert.equal(tCount('it', 1, 'platesOne', 'platesMany'), '1 piatto');
  assert.equal(tCount('it', 2, 'platesOne', 'platesMany'), '2 piatti');
  assert.equal(tCount('en', 0, 'platesOne', 'platesMany'), '0 plates');
});

test('pickLang prefers the saved choice, then the browser language', () => {
  assert.equal(pickLang('it', 'en-US'), 'it', 'saved wins');
  assert.equal(pickLang('en', 'it-IT'), 'en', 'saved wins');
  assert.equal(pickLang(null, 'it-IT'), 'it');
  assert.equal(pickLang(null, 'it'), 'it');
  assert.equal(pickLang(null, 'en-GB'), 'en');
  assert.equal(pickLang(null, 'fr-FR'), 'en');
  assert.equal(pickLang(null, undefined), 'en');
  assert.equal(pickLang('garbage', 'it-IT'), 'it', 'junk in storage is ignored');
});
