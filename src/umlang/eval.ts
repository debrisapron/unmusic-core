import * as _ from 'lodash/fp'
import { Parser as NearleyParser, Grammar as NearleyGrammar } from 'nearley'
import { Action, ParserContext, Parsing, ParsingType } from '../types'
import * as compiledGrammar from './grammar'

let DEFAULT_DURATION = 1 / 4
let PARAM_ALIASES = {
  d: 'dur',
  duration: 'dur',
  v: 'vel',
  velocity: 'vel'
}
let MIDDLE_A_NN = 69
let PITCH_CLASSES = {
  C: -9,
  'C♯': -8,
  'D♭': -8,
  D: -7,
  'D♯': -6,
  'E♭': -6,
  E: -5,
  F: -4,
  'F♯': -3,
  'G♭': -3,
  G: -2,
  'G♯': -1,
  'A♭': -1,
  A: 0,
  'A♯': 1,
  'B♭': 1,
  B: 2
}

function nnFrom(instruction) {
  switch (instruction.data.type) {
    case 'PITCH_CLASS':
      let value = instruction.data.value.replace('#', '♯').replace('b', '♭')
      return instruction.context.oct * 12 + MIDDLE_A_NN + PITCH_CLASSES[value]
    case 'RELATIVE':
      return instruction.context.oct * 12 + MIDDLE_A_NN + instruction.data.value
    case 'MIDI':
      return instruction.data.value
  }
  throw new Error('This note type is unknown to the score generator')
}

function noteActionFrom(instruction): Action {
  let nn = nnFrom(instruction)
  let payload = _.omit(['oct'], instruction.context)
  payload = _.set('nn', nn, payload)
  return { payload, type: 'NOTE' }
}

function trigActionFrom(instruction): Action {
  let payload = _.omit(['oct'], instruction.context)
  payload = _.set('name', instruction.data, payload)
  return { payload, type: 'TRIG' }
}

function restActionFrom(instruction) {
  return { type: 'NOOP', payload: { time: instruction.context.time } }
}

function generateScore(instructions) {
  return _.flatten(
    instructions.map((instruction) => {
      switch (instruction.type) {
        case 'NOTE':
          return noteActionFrom(instruction)
        case 'TRIG':
          return trigActionFrom(instruction)
        case 'REST':
          return restActionFrom(instruction)
        case 'CHORD_GROUP':
          return generateScore(instruction.data)
      }
      throw new Error('This instruction type is unknown to the score generator')
    })
  )
}

function optimizeIntermediate(instructions) {
  let lastIndex = instructions.length - 1
  instructions = instructions.filter(({ type }, i) => type !== 'REST' || i === lastIndex)
  let last = _.last(instructions)
  if (last.type === 'REST') {
    // HACK all aboard for mutation central
    last.context.time = last.context.time + last.context.dur
    delete last.context.dur
  }
  return instructions
}

function normalizeParamName(param) {
  return PARAM_ALIASES[param] || param
}

function generateIntermediate(
  parsings: Parsing[],
  context: ParserContext = { time: 0, oct: 0, dur: DEFAULT_DURATION }
) {
  return _.compact(
    parsings.map((parsing) => {
      let dur = context.dur

      // For settings, apply the setting to the context object & return.
      if (parsing.type === ParsingType.Setting) {
        context = { ...context, [normalizeParamName(parsing.data.param)]: parsing.data.value }
        return null
      }

      // For octave changes, apply the octave to the context object & return.
      if (parsing.type === ParsingType.OctaveChange) {
        context = { ...context, oct: context.oct + parsing.data }
        return null
      }

      let newData = parsing.data

      // For chord groups, run the members of the chord through
      // generateIntermediate, set all the members to start at the current time
      // and set the group duration to the duration of the longest member.
      // NOTE It is not necessary to optimize group members since a group cannot
      // contain rests.
      if (parsing.type === 'CHORD_GROUP') {
        newData = _.max(
          generateIntermediate(parsing.data, context)
            .map(_.set('context.time', context.time))
            .map((ins) => ins.context.dur)
        )
      }

      let instruction = { context, data: newData, type: parsing.type }
      context = _.set('time', context.time + dur, context)
      return instruction
    })
  )
}

let parse = (s: string): Parsing[] => {
  let parser = new NearleyParser(NearleyGrammar.fromCompiled(compiledGrammar))
  parser.feed(s)
  let parsings = parser.results
  if (parsings.length > 1) {
    throw new Error('Syntax error in sequence: combination is ambiguous')
  }
  return _.compact(parsings[0]).map((p) => ({ type: p[0], data: p[1] }))
}

////////////////////////////////////////////////////////////////////////////////

let umlangEval = (s: string): Action[] => {
  s = (s || '').trim()
  return generateScore(optimizeIntermediate(generateIntermediate(parse(s))))
}

export default umlangEval
