import { config } from '../src'

describe('config', () => {

  test('can set config options for a score', () => {
    let s = { actions: [
      { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1/4 } }
    ] }
    let expected = { actions: [
      { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1/4 } }
    ], config: { a: 1 } }
    expect(config({ a: 1 }, s)).toMatchObject(expected)
  })
})
