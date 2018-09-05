var _ = require('lodash/fp');
var actionHelpers = require('./actionHelpers');
// Repeat or trim a list of actions to the given length.
function extend(actions, length) {
    var loopLength = actionHelpers.lengthOf(actions);
    var wholeRepetitions = Math.floor(length / loopLength);
    var lastRepetitionLength = length % loopLength;
    var lastActions = trim(lastRepetitionLength, actions);
    var actionLists = wholeRepetitions ? Array(wholeRepetitions).fill(actions) : [];
    actionLists.push(lastActions);
    return actionHelpers.concat(actionLists);
}
// Trim a list of actions to the given length, shortening the last event if
// necessary.
// TODO should just shorten period, not dur
function trim(length, actions) {
    actions = actions.filter(function (a) { return a.payload.time < length; });
    if (!actions.length)
        return actions;
    if (actionHelpers.lengthOf(actions) > length) {
        var lastAction = _.last(actions);
        lastAction = _.set('payload.dur', length - lastAction.payload.time, lastAction);
        actions = _.initial(actions).concat(lastAction);
    }
    return actions;
}
// Next 3 function adapted from
// https://github.com/felipernb/algorithms.js/tree/master/src/algorithms/math
function pairGcd(a, b) {
    var tmp = a;
    a = Math.max(a, b);
    b = Math.min(tmp, b);
    while (b !== 0) {
        tmp = b;
        b = a % b;
        a = tmp;
    }
    return a;
}
function pairLcm(a, b) {
    if (a === 0 || b === 0)
        return 0;
    a = Math.abs(a);
    b = Math.abs(b);
    return (a / pairGcd(a, b)) * b;
}
function lcm(values) {
    return values.reduce(pairLcm);
}
function mixScores(scores) {
    var _a = _
        .partition(function (score) { return score.loop; }, scores)
        .map(function (scores) { return scores.map(actionHelpers.get); }), loops = _a[0], nonLoops = _a[1];
    if (loops.length) {
        // If there are any non-loops, adjust the length of any loops to the length
        // of the longest non-loop.
        // If there are only loops, adjust their lengths to the lowest common
        // multiple of all their lengths.
        var length_1 = nonLoops.length
            ? _.max(nonLoops.map(actionHelpers.lengthOf))
            : lcm(loops.map(actionHelpers.lengthOf));
        loops = loops.map(function (loop) { return extend(loop, length_1); });
    }
    var actionLists = loops.concat(nonLoops);
    var mixed = _.flatten(actionLists);
    var sorted = _.sortBy(['payload.time', 'payload.dur'], mixed);
    var score = actionHelpers.wrap(actionHelpers.clean(sorted));
    if (!nonLoops.length)
        score.loop = true;
    return score;
}
module.exports = mixScores;
