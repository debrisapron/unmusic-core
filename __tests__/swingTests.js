let { swing } = require('../src')

describe('swing', () => {
  test('can add swing to a score', () => {
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 1 / 16, nn: 69, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 1 / 8, nn: 69, dur: 1 / 16 } },
        { type: 'NOOP', payload: { time: 3 / 16 } }
      ]
    }
    let expScore = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 5 / 64, nn: 69, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 1 / 8, nn: 69, dur: 1 / 16 } },
        { type: 'NOOP', payload: { time: 3 / 16 } }
      ]
    }
    expect(swing(1 / 4, score)).toMatchObject(expScore)
  })
})
