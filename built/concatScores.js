var actionHelpers = require('./actionHelpers');
function concatScores(scores) {
    var actionLists = scores.map(actionHelpers.get);
    return actionHelpers.wrap(actionHelpers.clean(actionHelpers.concat(actionLists)));
}
module.exports = concatScores;
