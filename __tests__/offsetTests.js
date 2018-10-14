let { offset } = require('../src')

describe('offset', () => {
  test('can offset every action in a score', () => {
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
        { type: 'NOOP', payload: { time: 3 / 4 } }
      ]
    }
    let expScore = {
      actions: [
        {
          type: 'NOTE',
          payload: { time: 0, nn: 69, dur: 1 / 4, offset: -1 / 32 }
        },
        { type: 'NOOP', payload: { time: 3 / 4 } }
      ]
    }
    expect(offset(-1 / 32, score)).toMatchObject(expScore)
  })
})
