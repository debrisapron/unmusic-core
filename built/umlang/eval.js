"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash/fp");
var nearley_1 = require("nearley");
var types_1 = require("../types");
var compiledGrammar = require("./grammar");
var DEFAULT_DURATION = 1 / 4;
var PARAM_ALIASES = {
    d: 'dur',
    duration: 'dur',
    v: 'vel',
    velocity: 'vel'
};
var MIDDLE_A_NN = 69;
var PITCH_CLASSES = {
    C: -9,
    'C♯': -8,
    'D♭': -8,
    D: -7,
    'D♯': -6,
    'E♭': -6,
    E: -5,
    F: -4,
    'F♯': -3,
    'G♭': -3,
    G: -2,
    'G♯': -1,
    'A♭': -1,
    A: 0,
    'A♯': 1,
    'B♭': 1,
    B: 2
};
function nnFrom(instruction) {
    switch (instruction.data.type) {
        case 'PITCH_CLASS':
            var value = instruction.data.value.replace('#', '♯').replace('b', '♭');
            return instruction.context.oct * 12 + MIDDLE_A_NN + PITCH_CLASSES[value];
        case 'RELATIVE':
            return instruction.context.oct * 12 + MIDDLE_A_NN + instruction.data.value;
        case 'MIDI':
            return instruction.data.value;
    }
    throw new Error('This note type is unknown to the score generator');
}
function noteActionFrom(instruction) {
    var nn = nnFrom(instruction);
    var payload = _.omit(['oct'], instruction.context);
    payload = _.set('nn', nn, payload);
    return { payload: payload, type: 'NOTE' };
}
function trigActionFrom(instruction) {
    var payload = _.omit(['oct'], instruction.context);
    payload = _.set('name', instruction.data, payload);
    return { payload: payload, type: 'TRIG' };
}
function restActionFrom(instruction) {
    return { type: 'NOOP', payload: { time: instruction.context.time } };
}
function generateScore(instructions) {
    return _.flatten(instructions.map(function (instruction) {
        switch (instruction.type) {
            case 'NOTE':
                return noteActionFrom(instruction);
            case 'TRIG':
                return trigActionFrom(instruction);
            case 'REST':
                return restActionFrom(instruction);
            case 'CHORD_GROUP':
                return generateScore(instruction.data);
        }
        throw new Error('This instruction type is unknown to the score generator');
    }));
}
function optimizeIntermediate(instructions) {
    var lastIndex = instructions.length - 1;
    instructions = instructions.filter(function (_a, i) {
        var type = _a.type;
        return type !== 'REST' || i === lastIndex;
    });
    var last = _.last(instructions);
    if (last.type === 'REST') {
        // HACK all aboard for mutation central
        last.context.time = last.context.time + last.context.dur;
        delete last.context.dur;
    }
    return instructions;
}
function normalizeParamName(param) {
    return PARAM_ALIASES[param] || param;
}
function generateIntermediate(parsings, context) {
    if (context === void 0) { context = { time: 0, oct: 0, dur: DEFAULT_DURATION }; }
    return _.compact(parsings.map(function (parsing) {
        var _a;
        var dur = context.dur;
        // For settings, apply the setting to the context object & return.
        if (parsing.type === types_1.ParsingType.Setting) {
            context = __assign({}, context, (_a = {}, _a[normalizeParamName(parsing.data.param)] = parsing.data.value, _a));
            return null;
        }
        // For octave changes, apply the octave to the context object & return.
        if (parsing.type === types_1.ParsingType.OctaveChange) {
            context = __assign({}, context, { oct: context.oct + parsing.data });
            return null;
        }
        var newData = parsing.data;
        // For chord groups, run the members of the chord through
        // generateIntermediate, set all the members to start at the current time
        // and set the group duration to the duration of the longest member.
        // NOTE It is not necessary to optimize group members since a group cannot
        // contain rests.
        if (parsing.type === 'CHORD_GROUP') {
            newData = _.max(generateIntermediate(parsing.data, context)
                .map(_.set('context.time', context.time))
                .map(function (ins) { return ins.context.dur; }));
        }
        var instruction = { context: context, data: newData, type: parsing.type };
        context = _.set('time', context.time + dur, context);
        return instruction;
    }));
}
var parse = function (s) {
    var parser = new nearley_1.Parser(nearley_1.Grammar.fromCompiled(compiledGrammar));
    parser.feed(s);
    var parsings = parser.results;
    if (parsings.length > 1) {
        throw new Error('Syntax error in sequence: combination is ambiguous');
    }
    return _.compact(parsings[0]).map(function (p) { return ({ type: p[0], data: p[1] }); });
};
////////////////////////////////////////////////////////////////////////////////
var umlangEval = function (s) {
    s = (s || '').trim();
    return generateScore(optimizeIntermediate(generateIntermediate(parse(s))));
};
exports.default = umlangEval;
