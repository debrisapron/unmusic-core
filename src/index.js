let _ = require('lodash/fp')
let concatScores = require('./concatScores')
let getArpeggio = require('./getArpeggio')
let getScore = require('./getScore')
let mixScores = require('./mixScores')
let umlangEval = require('./umlang/eval')

// TODO Remove this. Too "clever".
function wrapScoringFunction(fn) {
  return fn.length === 1
    ? (thing) => fn(getScore(thing))
    : _.curry((options, thing) => fn(options, getScore(thing)))
}

let arpeg = wrapScoringFunction((opts, score) => {
  score = _.clone(score)
  let [noteActions, nonNoteActions] = _.partition((action) => {
    return action.type === 'NOTE'
  }, score.actions)
  noteActions = getArpeggio(noteActions, opts)
  score.actions = _.sortBy('payload.time', noteActions.concat(nonNoteActions))
  return score
})

let config = wrapScoringFunction((opts, score) => {
  return _.set('config', _.merge(score.config || {}, opts), score)
})

function flow(...args) {
  if (_.isFunction(args[0])) {
    return _.pipe(args)
  }
  let [thing, ...fns] = args
  return _.pipe(fns)(getScore(thing))
}

let loop = wrapScoringFunction((score) => {
  return _.set('loop', true, score)
})

function mix(...args) {
  return mixScores(args)
}

let offset = wrapScoringFunction((amount, score) => {
  score = _.cloneDeep(score)
  score.actions.forEach(({ payload, type }) => {
    if (type === 'NOOP') {
      return
    }
    payload.offset = amount
  })
  return score
})

let arrange = wrapScoringFunction((handler, score) => {
  score = _.cloneDeep(score)
  score.actions.forEach(({ payload, type }) => {
    if (type === 'NOOP') {
      return
    }
    payload.handlers = payload.handlers || []
    payload.handlers.push(handler)
  })
  return score
})

function seq(...args) {
  let [fns, scores] = _.partition(_.isFunction, args)
  return _.pipe(fns)(concatScores(scores))
}

let tempo = wrapScoringFunction((bpm, score) => {
  return _.set('tempo', bpm, score)
})

let tran = wrapScoringFunction((amount, score) => {
  score = _.cloneDeep(score)
  score.actions.forEach(({ payload }) => {
    if (payload.nn == null) {
      return
    }
    payload.nn = payload.nn + amount
  })
  return score
})

module.exports = {
  wrapScoringFunction,
  arpeg,
  config,
  flow,
  loop,
  mix,
  offset,
  arrange,
  seq,
  tempo,
  tran
}
