let _ = require('lodash/fp')
let _eval = require('./umscript/eval')

function nudge(amount, actions) {
  return actions.map((action) => {
    return _.set('payload.time', action.payload.time + amount, action)
  })
}

function endOf(action) {
  return action.payload.time + (action.payload.dur || 0)
}

////////////////////////////////////////////////////////////////////////////////

function wrap(actions) {
  return { actions }
}

function lengthOf(actions) {
  return endOf(_.last(actions))
}

function get(thing) {
  return (Array.isArray(thing) && thing) || thing.actions || _eval(thing)
}

function concat(actionLists) {
  return actionLists.reduce((acc, curr) => {
    return acc.concat(nudge(lengthOf(acc), curr))
  })
}

// Remove any redundant NOOP actions
function clean(actions) {
  let lastIndex = actions.length - 1
  return actions.filter((action, i) => {
    // Include all non-NOOP actions
    if (action.type !== 'NOOP') {
      return true
    }
    // Reject NOOP actions unless they are at the end
    if (i !== lastIndex) {
      return false
    }
    // Reject redundant NOOP actions (i.e. onset during another NOOP action)
    let prevAction = actions[i - 1]
    return action.payload.time > endOf(prevAction)
  })
}

module.exports = { wrap, lengthOf, get, concat, clean }
