var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
// NOTE While the outer function is pure, inside it the design is very very
// imperative, with uncontrolled mutation all over the shop. Might be good to
// rethink...
var _ = require('lodash/fp');
var actionHelpers = require('./actionHelpers');
function LoopList(arr) {
    var i = 0;
    function reset() {
        i = 0;
    }
    function current() {
        return arr[i];
    }
    function advance() {
        i++;
        if (i >= arr.length) {
            i = 0;
        }
        return current();
    }
    return { advance: advance, current: current, reset: reset };
}
// TODO Make sure length of arpeg is never longer than length of sequence (will
// require sorting notes & non-notes here).
function getArpeggio(actions, _a) {
    var _b = _a.dur, dur = _b === void 0 ? 1 / 16 : _b, _c = _a.patt, patt = _c === void 0 ? ['u'] : _c;
    var length = actionHelpers.lengthOf(actions);
    var payloads = actions.map(function (action) { return action.payload; });
    var pattLoop = LoopList(_.isArray(patt) ? patt : patt.split(''));
    var prevNote;
    function getTransposition() {
        return parseInt(pattLoop.current().split('')[1] || 0) * 12;
    }
    function getDir() {
        return pattLoop
            .current()
            .toLowerCase()
            .startsWith('d')
            ? -1
            : 1;
    }
    // Gets next note in current direction (-1 or +1). If no note is found in that
    // direction (i.e. we've hit boundary of chord), returns null.
    function getNextNote(chord) {
        var dir = getDir();
        var sortedChord = _.sortBy(function (note) { return note.nn * dir; }, chord);
        if (!prevNote) {
            return sortedChord[0];
        }
        return dir === 1
            ? sortedChord.find(function (note) { return note.nn > prevNote.nn; })
            : sortedChord.find(function (note) { return note.nn < prevNote.nn; });
    }
    function getNoteOfChord(chord) {
        if (!chord.length) {
            pattLoop.reset();
            return null;
        }
        if (chord.length === 1) {
            pattLoop.advance();
            return chord[0];
        }
        var note = getNextNote(chord);
        if (!note) {
            // We've hit the end of the chord.
            // If new mode is same as previous mode, or new mode is capitalized,
            // reset to first note of chord.
            var oldMode = pattLoop.current().split('')[0];
            var newMode = pattLoop.advance().split('')[0];
            if (newMode === newMode.toUpperCase() || newMode === oldMode) {
                prevNote = null;
            }
            note = getNextNote(chord);
        }
        return note;
    }
    function getChordPlayingAtTime(t) {
        return payloads.filter(function (p) { return p.time <= t && p.time + (p.dur || 0) > t; });
    }
    function getArpeggioNotes() {
        var times = [];
        for (var f = 0; f < length; f += dur) {
            times.push(f);
        }
        var notesAndRests = times.map(function (time) {
            var chord = getChordPlayingAtTime(time);
            var note = getNoteOfChord(chord);
            prevNote = note;
            if (!note) {
                return null;
            }
            return __assign({}, note, { nn: note.nn + getTransposition(), time: time, dur: dur });
        });
        return _.compact(notesAndRests);
    }
    return getArpeggioNotes().map(function (payload) { return ({ payload: payload, type: 'NOTE' }); });
}
module.exports = getArpeggio;
