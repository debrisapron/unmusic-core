let nearley = require('nearley')
let grammar = require('../../src/umlang/grammar')

describe('umlang parser', () => {
  test('can parse an umlang string', () => {
    let s = 'C /16 x=1 >'
    let expected = [
      ['NOTE', { type: 'PITCH_CLASS', value: 'C' }],
      ['SETTING', { param: 'duration', value: 1 / 16 }],
      ['SETTING', { param: 'x', value: 1 }],
      ['OCTAVE_CHANGE', 1]
    ]
    let parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
    parser.feed(s)
    let parsings = parser.results
    expect(parsings.length).toEqual(1)
    let results = parsings[0]
    expect(results).toMatchObject(expected)
  })
})
