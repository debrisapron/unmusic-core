import _ from 'lodash/fp'
import { mix } from '../src'

describe('mix', () => {

  test('can mix two scores', () => {
    let s1 = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 3/8, nn: 69, dur: 1/4 } }
    ] }
    let s2 = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 70, dur: 1/8 } },
      { type: 'NOOP', payload: { time: 3/8 } }
    ] }
    let expected = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 0,   nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 70, dur: 1/8 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 3/8, nn: 69, dur: 1/4 } }
    ] }
    expect(mix(s1, s2)).toMatchObject(expected)
  })

  test('can mix two scores, one looped, one not', () => {
    let s1 = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 3/8, nn: 69, dur: 1/4 } }
    ], loop: true }
    let s2 = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 3/4, nn: 70, dur: 1/4 } }
    ] }
    let expected = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 0,   nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 3/8, nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 5/8, nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 3/4, nn: 70, dur: 1/4 } }
    ] }
    expect(sort(mix(s1, s2))).toMatchObject(expected)
  })

  test('can mix two looped scores', () => {
    let s1 = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 69, dur: 1/4 } }
    ], loop: true }
    let s2 = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/2, nn: 70, dur: 1/4 } }
    ], loop: true }
    let expected = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 0,   nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/2, nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/2, nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 3/4, nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 3/4, nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1,   nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 5/4, nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 5/4, nn: 70, dur: 1/4 } }
    ], loop: true }
    expect(sort(mix(s1, s2))).toMatchObject(expected)
  })
})

function sort(score) {
  let sortedActions = _.sortBy(['payload.time', 'payload.nn'], score.actions)
  return _.set('actions', sortedActions, score)
}
