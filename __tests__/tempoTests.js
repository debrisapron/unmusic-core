import { tempo } from '../src'

describe('tempo', () => {

  test('can set tempo of a seq', () => {
    let s = { actions: [
      { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1/4 } }
    ] }
    let expected = { actions: [
      { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1/4 } }
    ], tempo: 105 }
    expect(tempo(105, s)).toMatchObject(expected)
  })
})
