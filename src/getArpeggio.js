// NOTE While the outer function is pure, inside it the design is very very
// imperative, with uncontrolled mutation all over the shop. Might be good to
// rethink...
import * as _ from 'lodash/fp'
import * as actionHelpers from './actionHelpers'

function LoopList(arr) {
  let i = 0

  function reset() {
    i = 0
  }

  function current() {
    return arr[i]
  }

  function advance() {
    i++
    if (i >= arr.length) { i = 0 }
    return current()
  }

  return { advance, current, reset }
}

// TODO Make sure length of arpeg is never longer than length of sequence (will
// require sorting notes & non-notes here).
export default function getArpeggio(actions, { dur = 1/16, patt = ['u'] }) {
  let length = actionHelpers.lengthOf(actions)
  let payloads = actions.map((action) => action.payload)
  let pattLoop = LoopList(_.isArray(patt) ? patt : patt.split(''))
  let prevNote

  function getTransposition() {
    return parseInt(pattLoop.current().split('')[1] || 0) * 12
  }

  function getDir() {
    return pattLoop.current().toLowerCase().startsWith('d') ? -1 : 1
  }

  // Gets next note in current direction (-1 or +1). If no note is found in that
  // direction (i.e. we've hit boundary of chord), returns null.
  function getNextNote(chord) {
    let dir = getDir()
    let sortedChord = _.sortBy((note) => note.nn * dir, chord)
    if (!prevNote) { return sortedChord[0] }

    return dir === 1
      ? sortedChord.find((note) => note.nn > prevNote.nn)
      : sortedChord.find((note) => note.nn < prevNote.nn)
  }

  function getNoteOfChord(chord) {
    if (!chord.length) {
      pattLoop.reset()
      return null
    }
    if (chord.length === 1) {
      pattLoop.advance()
      return chord[0]
    }
    let note = getNextNote(chord)
    if (!note) {
      // We've hit the end of the chord.
      // If new mode is same as previous mode, or new mode is capitalized,
      // reset to first note of chord.
      let oldMode = pattLoop.current().split('')[0]
      let newMode = pattLoop.advance().split('')[0]
      if (newMode === newMode.toUpperCase() || newMode === oldMode) {
        prevNote = null
      }
      note = getNextNote(chord)
    }
    return note
  }

  function getChordPlayingAtTime(t) {
    return payloads.filter((p) => p.time <= t && p.time + (p.dur || 0) > t)
  }

  function getArpeggioNotes() {
    let times = []
    for (let f = 0; f < length; f += dur) { times.push(f) }
    let notesAndRests = times.map((time) => {
      let chord = getChordPlayingAtTime(time)
      let note = getNoteOfChord(chord)
      prevNote = note
      if (!note) { return null }
      return { ...note, nn: note.nn + getTransposition(), time, dur }
    })
    return _.compact(notesAndRests)
  }

  return getArpeggioNotes().map((payload) => ({ payload, type: 'NOTE' }))
}
