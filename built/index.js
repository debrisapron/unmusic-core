var _ = require('lodash/fp');
var concatScores = require('./concatScores');
var getArpeggio = require('./getArpeggio');
var getScore = require('./getScore');
var mixScores = require('./mixScores');
var umlangEval = require('./umlang/eval');
// TODO Remove this. Too "clever".
function wrapScoringFunction(fn) {
    return fn.length === 1
        ? function (thing) { return fn(getScore(thing)); }
        : _.curry(function (options, thing) { return fn(options, getScore(thing)); });
}
var arpeg = wrapScoringFunction(function (opts, score) {
    score = _.clone(score);
    var _a = _.partition(function (action) {
        return action.type === 'NOTE';
    }, score.actions), noteActions = _a[0], nonNoteActions = _a[1];
    noteActions = getArpeggio(noteActions, opts);
    score.actions = _.sortBy('payload.time', noteActions.concat(nonNoteActions));
    return score;
});
var config = wrapScoringFunction(function (opts, score) {
    return _.set('config', _.merge(score.config || {}, opts), score);
});
function flow() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (_.isFunction(args[0])) {
        return _.pipe(args);
    }
    var thing = args[0], fns = args.slice(1);
    return _.pipe(fns)(getScore(thing));
}
var loop = wrapScoringFunction(function (score) {
    return _.set('loop', true, score);
});
function mix() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return mixScores(args);
}
var offset = wrapScoringFunction(function (amount, score) {
    score = _.cloneDeep(score);
    score.actions.forEach(function (_a) {
        var payload = _a.payload, type = _a.type;
        if (type === 'NOOP') {
            return;
        }
        payload.offset = amount;
    });
    return score;
});
var arrange = wrapScoringFunction(function (handler, score) {
    score = _.cloneDeep(score);
    score.actions.forEach(function (_a) {
        var payload = _a.payload, type = _a.type;
        if (type === 'NOOP') {
            return;
        }
        payload.handlers = payload.handlers || [];
        payload.handlers.push(handler);
    });
    return score;
});
function seq() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var _a = _.partition(_.isFunction, args), fns = _a[0], scores = _a[1];
    return _.pipe(fns)(concatScores(scores));
}
var tempo = wrapScoringFunction(function (bpm, score) {
    return _.set('tempo', bpm, score);
});
var tran = wrapScoringFunction(function (amount, score) {
    score = _.cloneDeep(score);
    score.actions.forEach(function (_a) {
        var payload = _a.payload;
        if (payload.nn == null) {
            return;
        }
        payload.nn = payload.nn + amount;
    });
    return score;
});
module.exports = {
    wrapScoringFunction: wrapScoringFunction,
    arpeg: arpeg,
    config: config,
    flow: flow,
    loop: loop,
    mix: mix,
    offset: offset,
    arrange: arrange,
    seq: seq,
    tempo: tempo,
    tran: tran
};
