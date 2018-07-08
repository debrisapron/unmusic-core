// Generated automatically by nearley, version 2.11.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  function str(data) {
    return data.join('')
  }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "SEQUENCE", "symbols": ["TOKEN"], "postprocess": id},
    {"name": "SEQUENCE", "symbols": ["SEQUENCE", "_", "TOKEN"], "postprocess": (data) => data[0].concat(data[2])},
    {"name": "TOKEN", "symbols": ["NOTE"]},
    {"name": "TOKEN", "symbols": ["TRIG"]},
    {"name": "TOKEN", "symbols": ["REST"]},
    {"name": "TOKEN", "symbols": ["OCTAVE_CHANGE"]},
    {"name": "TOKEN", "symbols": ["SETTING"]},
    {"name": "TOKEN", "symbols": ["CHORD_GROUP"]},
    {"name": "NOTE", "symbols": ["PITCH_CLASS"], "postprocess": (data) => ['NOTE', { type: 'PITCH_CLASS', value: data[0] }]},
    {"name": "NOTE", "symbols": [{"literal":"M"}, "INTEGER"], "postprocess": (data) => ['NOTE', { type: 'MIDI',        value: data[1] }]},
    {"name": "NOTE", "symbols": ["INTEGER"], "postprocess": (data) => ['NOTE', { type: 'RELATIVE',    value: data[0] }]},
    {"name": "PITCH_CLASS$ebnf$1", "symbols": [/[b♭#♯]/], "postprocess": id},
    {"name": "PITCH_CLASS$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "PITCH_CLASS", "symbols": [/[A-G]/, "PITCH_CLASS$ebnf$1"], "postprocess": (data) => str(data)},
    {"name": "TRIG", "symbols": ["IDENTIFIER"], "postprocess": (data) => ['TRIG', data[0]]},
    {"name": "REST$ebnf$1", "symbols": [{"literal":"_"}]},
    {"name": "REST$ebnf$1", "symbols": ["REST$ebnf$1", {"literal":"_"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "REST", "symbols": ["REST$ebnf$1"], "postprocess": (data) => ['REST', data[0].length]},
    {"name": "OCTAVE_CHANGE$ebnf$1", "symbols": [{"literal":"<"}]},
    {"name": "OCTAVE_CHANGE$ebnf$1", "symbols": ["OCTAVE_CHANGE$ebnf$1", {"literal":"<"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "OCTAVE_CHANGE", "symbols": ["OCTAVE_CHANGE$ebnf$1"], "postprocess": (data) => ['OCTAVE_CHANGE', parseInt('-' + data[0].length)]},
    {"name": "OCTAVE_CHANGE$ebnf$2", "symbols": [{"literal":">"}]},
    {"name": "OCTAVE_CHANGE$ebnf$2", "symbols": ["OCTAVE_CHANGE$ebnf$2", {"literal":">"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "OCTAVE_CHANGE", "symbols": ["OCTAVE_CHANGE$ebnf$2"], "postprocess": (data) => ['OCTAVE_CHANGE', parseInt(data[0].length)]},
    {"name": "SETTING", "symbols": ["IDENTIFIER", {"literal":"="}, "VALUE"], "postprocess": (data) => ['SETTING', { param: data[0],    value: data[2] }]},
    {"name": "SETTING", "symbols": ["NOTE_VALUE"], "postprocess": (data) => ['SETTING', { param: 'duration', value: data[0] }]},
    {"name": "VALUE", "symbols": ["NOTE_VALUE"], "postprocess": id},
    {"name": "VALUE", "symbols": ["STRING"], "postprocess": (data) => !isNaN(data[0]) ? parseFloat(data[0]) : data[0]},
    {"name": "NOTE_VALUE", "symbols": ["INTEGER", {"literal":"/"}, "INTEGER"], "postprocess": (data) => data[0] / data[2]},
    {"name": "NOTE_VALUE", "symbols": [{"literal":"/"}, "INTEGER"], "postprocess": (data) => 1 / data[1]},
    {"name": "NOTE_VALUE", "symbols": ["INTEGER", {"literal":"/"}], "postprocess": id},
    {"name": "CHORD_GROUP$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "CHORD_GROUP$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "CHORD_GROUP$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "CHORD_GROUP$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "CHORD_GROUP", "symbols": [{"literal":"{"}, "CHORD_GROUP$ebnf$1", "CHORD_TOKENS", "CHORD_GROUP$ebnf$2", {"literal":"}"}], "postprocess": (data) => ['CHORD_GROUP', data[2]]},
    {"name": "CHORD_TOKENS", "symbols": ["CHORD_TOKEN"], "postprocess": id},
    {"name": "CHORD_TOKENS", "symbols": ["CHORD_TOKENS", "_", "CHORD_TOKEN"], "postprocess": (data) => data[0].concat(data[2])},
    {"name": "CHORD_TOKEN", "symbols": ["NOTE"]},
    {"name": "CHORD_TOKEN", "symbols": ["SETTING"]},
    {"name": "CHORD_TOKEN", "symbols": ["OCTAVE_CHANGE"]},
    {"name": "IDENTIFIER$ebnf$1", "symbols": ["STRING"], "postprocess": id},
    {"name": "IDENTIFIER$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "IDENTIFIER", "symbols": ["LCASE_LETTER", "IDENTIFIER$ebnf$1"], "postprocess": (data) => str(data[0].concat(data[1]))},
    {"name": "LCASE_LETTER", "symbols": [/[a-z]/]},
    {"name": "STRING$ebnf$1", "symbols": [/[a-zA-Z$_0-9.]/]},
    {"name": "STRING$ebnf$1", "symbols": ["STRING$ebnf$1", /[a-zA-Z$_0-9.]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "STRING", "symbols": ["STRING$ebnf$1"], "postprocess": (data) => str(data[0])},
    {"name": "NUMBER", "symbols": ["FLOAT"]},
    {"name": "NUMBER", "symbols": ["INTEGER"]},
    {"name": "FLOAT$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "FLOAT$ebnf$1", "symbols": ["FLOAT$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "FLOAT", "symbols": ["INTEGER", {"literal":"."}, "FLOAT$ebnf$1"], "postprocess": (data) => parseFloat(str(data))},
    {"name": "INTEGER$ebnf$1", "symbols": [/[-+]/], "postprocess": id},
    {"name": "INTEGER$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "INTEGER$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "INTEGER$ebnf$2", "symbols": ["INTEGER$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INTEGER", "symbols": ["INTEGER$ebnf$1", "INTEGER$ebnf$2"], "postprocess": (data) => parseInt((data[0] === '-' ? '-' : '') + str(data[1]))},
    {"name": "_$ebnf$1", "symbols": [/[\s]/]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "SEQUENCE"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
