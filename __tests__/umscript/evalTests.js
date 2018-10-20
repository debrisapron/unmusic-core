let _eval = require('../../src/umscript/eval')

describe('umscript evaluator', () => {
  test('can eval a single note', () => {
    let s = 'A'
    let expected = [{ type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } }]
    expect(_eval(s)).toMatchObject(expected)
  })

  test('can eval a trigger', () => {
    let s = 'foo'
    let expected = [
      { type: 'TRIG', payload: { time: 0, name: 'foo', dur: 1 / 4 } }
    ]
    expect(_eval(s)).toMatchObject(expected)
  })

  test('can eval an enumerated chord', () => {
    let s = '{A B C}'
    let expected = [
      { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
      { type: 'NOTE', payload: { time: 0, nn: 71, dur: 1 / 4 } },
      { type: 'NOTE', payload: { time: 0, nn: 60, dur: 1 / 4 } }
    ]
    expect(_eval(s)).toMatchObject(expected)
  })

  test('should make chords have length of longest member', () => {
    let s = '{A B /2 C} D'
    let expected = [
      { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
      { type: 'NOTE', payload: { time: 0, nn: 71, dur: 1 / 4 } },
      { type: 'NOTE', payload: { time: 0, nn: 60, dur: 1 / 2 } },
      { type: 'NOTE', payload: { time: 1 / 2, nn: 62, dur: 1 / 4 } }
    ]
    expect(_eval(s)).toMatchObject(expected)
  })

  test('can set duration', () => {
    let s = 'd=/8 A'
    let expected = [{ type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 8 } }]
    expect(_eval(s)).toMatchObject(expected)
  })

  test('can set octave', () => {
    let s = '> A'
    let expected = [{ type: 'NOTE', payload: { time: 0, nn: 81, dur: 1 / 4 } }]
    expect(_eval(s)).toMatchObject(expected)
  })

  test('can chain different settings, notes and rests', () => {
    let s = '  < d=/8 C dur=/16 -10 /8 _ /4 M55 {C D} _  '
    let expected = [
      { type: 'NOTE', payload: { time: 0, nn: 48, dur: 1 / 8 } },
      { type: 'NOTE', payload: { time: 1 / 8, nn: 47, dur: 1 / 16 } },
      { type: 'NOTE', payload: { time: 5 / 16, nn: 55, dur: 1 / 4 } },
      { type: 'NOTE', payload: { time: 9 / 16, nn: 48, dur: 1 / 4 } },
      { type: 'NOTE', payload: { time: 9 / 16, nn: 50, dur: 1 / 4 } },
      { type: 'NOOP', payload: { time: 17 / 16 } }
    ]
    expect(_eval(s)).toMatchObject(expected)
  })

  test('can use returns interchangably with spaces', () => {
    let s = `  <
d=/8 C
 dur=/16 -10 /8
_ /4 M55 _
`
    let expected = [
      { type: 'NOTE', payload: { time: 0, nn: 48, dur: 1 / 8 } },
      { type: 'NOTE', payload: { time: 1 / 8, nn: 47, dur: 1 / 16 } },
      { type: 'NOTE', payload: { time: 5 / 16, nn: 55, dur: 1 / 4 } },
      { type: 'NOOP', payload: { time: 13 / 16 } }
    ]
    expect(_eval(s)).toMatchObject(expected)
  })
})
