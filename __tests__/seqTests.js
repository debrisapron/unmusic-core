import { seq } from '../src'

describe('seq', () => {

  test('can parse a seq string with just a command', () => {
    let s = 'A'
    let expected = { actions: [
      { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1/4 } }
    ] }
    expect(seq(s)).toMatchObject(expected)
  })

  test('can sequence two scores', () => {
    let s1 = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 69, dur: 1/4 } },
      { type: 'NOOP', payload: { time: 3/4 } }
    ] }
    let s2 = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 70, dur: 1/4 } }
    ] }
    let expected = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 3/4, nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1,   nn: 70, dur: 1/4 } }
    ] }
    expect(seq(s1, s2)).toMatchObject(expected)
  })

  test('can sequence a score with a string', () => {
    let s1 = 'A'
    let s2 = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 70, dur: 1/4 } }
    ] }
    let expected = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 69, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 70, dur: 1/4 } },
      { type: 'NOTE', payload: { time: 1/2, nn: 70, dur: 1/4 } }
    ] }
    expect(seq(s1, s2)).toMatchObject(expected)
  })

  test('can pipe a score through any number of functions', () => {
    let fn1 = (score) => {
      score.actions.forEach(({ payload }) => payload.foo = 1)
      return score
    }
    let fn2 = (score) => {
      score.actions.forEach(({ payload }) => payload.bar = payload.foo + 1)
      return score
    }
    let expected = { actions: [
      { type: 'NOTE', payload: { time: 0,   nn: 69, dur: 1/4, foo: 1, bar: 2 } },
      { type: 'NOTE', payload: { time: 1/4, nn: 71, dur: 1/4, foo: 1, bar: 2 } }
    ] }
    expect(seq('A', 'B', fn1, fn2)).toMatchObject(expected)
  })
})
