"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionType;
(function (ActionType) {
    ActionType["Noop"] = "NOOP";
    ActionType["Note"] = "NOTE";
    ActionType["Trig"] = "TRIG";
})(ActionType || (ActionType = {}));
// Parser types
var ParsingType;
(function (ParsingType) {
    ParsingType["Setting"] = "SETTING";
    ParsingType["OctaveChange"] = "OCTAVE_CHANGE";
    ParsingType["ChordGroup"] = "CHORD_GROUP";
})(ParsingType = exports.ParsingType || (exports.ParsingType = {}));
