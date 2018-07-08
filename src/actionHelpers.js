import _ from 'lodash/fp'
import evalUmlang from './umlang/eval'

function nudge(amount, actions) {
  return actions.map((action) => {
    return _.set('payload.time', action.payload.time + amount, action)
  })
}

function endOf(action) {
  return action.payload.time + (action.payload.dur || 0)
}

////////////////////////////////////////////////////////////////////////////////

export function wrap(actions) {
  return { actions }
}

export function lengthOf(actions) {
  return endOf(_.last(actions))
}

export function get(thing) {
  return (Array.isArray(thing) && thing) || thing.actions || evalUmlang(thing)
}

export function concat(actionLists) {
  return actionLists.reduce((acc, curr) => {
    return acc.concat(nudge(lengthOf(acc), curr))
  })
}

// Remove any redundant NOOP actions
export function clean(actions) {
  let lastIndex = actions.length - 1
  return actions.filter((action, i) => {
    // Include all non-NOOP actions
    if (action.type !== 'NOOP') { return true }
    // Reject NOOP actions unless they are at the end
    if (i !== lastIndex) { return false }
    // Reject redundant NOOP actions (i.e. onset during another NOOP action)
    let prevAction = actions[i - 1]
    return action.payload.time > endOf(prevAction)
  })
}
