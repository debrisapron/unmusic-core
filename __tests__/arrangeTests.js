let { arrange } = require('../src')

describe('arrange', () => {
  test('can add a handler to every action in a score', () => {
    let foo = {}
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
        { type: 'NOOP', payload: { time: 3 / 4 } }
      ]
    }
    let expScore = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4, handlers: [foo] } },
        { type: 'NOOP', payload: { time: 3 / 4 } }
      ]
    }
    expect(arrange(foo, score)).toMatchObject(expScore)
  })
})
