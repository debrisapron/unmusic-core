let actionHelpers = require('./actionHelpers')

function getScore(thing) {
  return thing.actions ? thing : actionHelpers.wrap(actionHelpers.get(thing))
}

module.exports = getScore
