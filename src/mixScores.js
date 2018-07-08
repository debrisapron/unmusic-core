import _ from 'lodash/fp'
import * as actionHelpers from './actionHelpers'

// Repeat or trim a list of actions to the given length.
function extend(actions, length) {
  let loopLength = actionHelpers.lengthOf(actions)
  let wholeRepetitions = Math.floor(length / loopLength)
  let lastRepetitionLength = length % loopLength
  let lastActions = trim(lastRepetitionLength, actions)
  let actionLists = wholeRepetitions
    ? Array(wholeRepetitions).fill(actions)
    : []
  actionLists.push(lastActions)
  return actionHelpers.concat(actionLists)
}

// Trim a list of actions to the given length, shortening the last event if
// necessary.
// TODO should just shorten period, not dur
function trim(length, actions) {
  actions = actions.filter((a) => a.payload.time < length)
  if (!actions.length) return actions
  if (actionHelpers.lengthOf(actions) > length) {
    let lastAction = _.last(actions)
    lastAction = _.set('payload.dur', length - lastAction.payload.time, lastAction)
    actions = _.initial(actions).concat(lastAction)
  }
  return actions
}

// Next 3 function adapted from
// https://github.com/felipernb/algorithms.js/tree/master/src/algorithms/math

function pairGcd(a, b) {
  let tmp = a
  a = Math.max(a, b)
  b = Math.min(tmp, b)
  while (b !== 0) {
    tmp = b
    b = a % b
    a = tmp
  }

  return a
}

function pairLcm(a, b) {
  if (a === 0 || b === 0) return 0
  a = Math.abs(a)
  b = Math.abs(b)
  return a / pairGcd(a, b) * b
}

function lcm(values) {
  return values.reduce(pairLcm)
}

export default function mixScores(scores) {
  let [loops, nonLoops] = _.partition((score) => score.loop, scores)
    .map((scores) => scores.map(actionHelpers.get))

  if (loops.length) {
    // If there are any non-loops, adjust the length of any loops to the length
    // of the longest non-loop.
    // If there are only loops, adjust their lengths to the lowest common
    // multiple of all their lengths.
    let length = nonLoops.length
      ? _.max(nonLoops.map(actionHelpers.lengthOf))
      : lcm(loops.map(actionHelpers.lengthOf))
    loops = loops.map((loop) => extend(loop, length))
  }

  let actionLists = loops.concat(nonLoops)
  let mixed = _.flatten(actionLists)
  let sorted = _.sortBy(['payload.time', 'payload.dur'], mixed)
  let score = actionHelpers.wrap(actionHelpers.clean(sorted))
  if (!nonLoops.length) score.loop = true
  return score
}
