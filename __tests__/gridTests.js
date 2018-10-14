let { grid } = require('../src')

describe('grid', () => {
  test('can create a sequence from a grid', () => {
    let s = {
      'A   ': 'x| |-._x',
      '/8 B': 'xx'
    }
    let expected = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 0, nn: 71, dur: 1 / 8 } },
        { type: 'NOTE', payload: { time: 1 / 8, nn: 71, dur: 1 / 8 } },
        { type: 'NOTE', payload: { time: 4 / 16, nn: 69, dur: 1 / 16 } }
      ]
    }
    expect(grid(s)).toMatchObject(expected)
  })
})
