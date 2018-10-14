let _ = require('lodash/fp')
let concatScores = require('./concatScores')
let getArpeggio = require('./getArpeggio')
let getScore = require('./getScore')
let mixScores = require('./mixScores')
let umlangEval = require('./umlang/eval')

const GRID_WHITESPACE_CHARS = ['|', ' ']
const GRID_REST_CHARS = ['.', '-', '_']

// TODO Remove this. Too "clever".
let wrapFn = (fn) => {
  return fn.length === 1
    ? (thing) => fn(getScore(thing))
    : _.curry((options, thing) => fn(options, getScore(thing)))
}

///////////////////////////////////////////////////////////////////////////////

let arpeg = wrapFn((opts, score) => {
  score = _.clone(score)
  let [noteActions, nonNoteActions] = _.partition((action) => {
    return action.type === 'NOTE'
  }, score.actions)
  noteActions = getArpeggio(noteActions, opts)
  score.actions = _.sortBy('payload.time', noteActions.concat(nonNoteActions))
  return score
})

let arrange = wrapFn((handler, score) => {
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

let config = wrapFn((opts, score) => {
  return _.set('config', _.merge(score.config || {}, opts), score)
})

let flow = (...args) => {
  if (_.isFunction(args[0])) {
    return _.pipe(args)
  }
  let [thing, ...fns] = args
  return _.pipe(fns)(getScore(thing))
}

let grid = (obj) =>
  mixScores(
    Object.keys(obj).map((action) => {
      let rowStr = obj[action]
      let rowScript = rowStr
        .split('')
        .filter((char) => !GRID_WHITESPACE_CHARS.includes(char))
        .map((char) => (GRID_REST_CHARS.includes(char) ? '_' : action))
        .join(' ')
      return `/16 ${rowScript}`
    })
  )

let loop = wrapFn((score) => {
  return _.set('loop', true, score)
})

let mix = (...args) => {
  return mixScores(args)
}

let offset = wrapFn((amount, score) => {
  score = _.cloneDeep(score)
  score.actions.forEach(({ payload, type }) => {
    if (type === 'NOOP') {
      return
    }
    payload.offset = amount
  })
  return score
})

let seq = (...args) => {
  let [fns, scores] = _.partition(_.isFunction, args)
  return _.pipe(fns)(concatScores(scores))
}

let tempo = wrapFn((bpm, score) => {
  return _.set('tempo', bpm, score)
})

let tran = wrapFn((amount, score) => {
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
  arpeg,
  arrange,
  config,
  flow,
  grid,
  loop,
  mix,
  offset,
  seq,
  tempo,
  tran
}
