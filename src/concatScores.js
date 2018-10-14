let actionHelpers = require('./actionHelpers')

function concatScores(scores) {
  let actionLists = scores.map(actionHelpers.get)
  return actionHelpers.wrap(
    actionHelpers.clean(actionHelpers.concat(actionLists))
  )
}

module.exports = concatScores
