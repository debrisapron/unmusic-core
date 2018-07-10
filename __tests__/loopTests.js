let { loop } = require('../src')

describe('loop', () => {
  test('can loop a seq', () => {
    let s = {
      actions: [{ type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } }]
    }
    let expected = {
      actions: [{ type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } }],
      loop: true
    }
    expect(loop(s)).toMatchObject(expected)
  })
})
