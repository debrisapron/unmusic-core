let { arpeg } = require('../src')

describe('arpeg', () => {
  test('can convert chords to arpeggio with default settings', () => {
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 73, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 76, dur: 1 / 4 } },
        { type: 'NOOP', payload: { time: 1 / 4 } }
      ]
    }
    let expScore = {
      actions: [
        { type: 'NOTE', payload: { time: 0 / 16, nn: 69, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 1 / 16, nn: 73, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 2 / 16, nn: 76, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 3 / 16, nn: 69, dur: 1 / 16 } },
        { type: 'NOOP', payload: { time: 4 / 16 } }
      ]
    }
    expect(arpeg({}, score)).toMatchObject(expScore)
  })

  test('can convert chords to arpeggio of 1/8th notes', () => {
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 73, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 76, dur: 1 / 4 } },
        { type: 'NOOP', payload: { time: 1 / 4 } }
      ]
    }
    let expScore = {
      actions: [
        { type: 'NOTE', payload: { time: 0 / 8, nn: 69, dur: 1 / 8 } },
        { type: 'NOTE', payload: { time: 1 / 8, nn: 73, dur: 1 / 8 } },
        { type: 'NOOP', payload: { time: 2 / 8 } }
      ]
    }
    expect(arpeg({ dur: 1 / 8 }, score)).toMatchObject(expScore)
  })

  test('can arpeggiate downwards', () => {
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 73, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 76, dur: 1 / 4 } },
        { type: 'NOOP', payload: { time: 1 / 4 } }
      ]
    }
    let expScore = {
      actions: [
        { type: 'NOTE', payload: { time: 0 / 16, nn: 76, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 1 / 16, nn: 73, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 2 / 16, nn: 69, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 3 / 16, nn: 76, dur: 1 / 16 } },
        { type: 'NOOP', payload: { time: 4 / 16 } }
      ]
    }
    expect(arpeg({ patt: 'd' }, score)).toMatchObject(expScore)
  })

  test('can arpeggiate up & down', () => {
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 73, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 76, dur: 1 / 4 } },
        { type: 'NOOP', payload: { time: 1 / 4 } }
      ]
    }
    let expScore = {
      actions: [
        { type: 'NOTE', payload: { time: 0 / 16, nn: 69, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 1 / 16, nn: 73, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 2 / 16, nn: 76, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 3 / 16, nn: 73, dur: 1 / 16 } },
        { type: 'NOOP', payload: { time: 4 / 16 } }
      ]
    }
    expect(arpeg({ patt: 'ud' }, score)).toMatchObject(expScore)
  })

  test('can arpeggiate down & up', () => {
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 73, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 76, dur: 1 / 4 } },
        { type: 'NOOP', payload: { time: 1 / 4 } }
      ]
    }
    let expScore = {
      actions: [
        { type: 'NOTE', payload: { time: 0 / 16, nn: 76, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 1 / 16, nn: 73, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 2 / 16, nn: 69, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 3 / 16, nn: 73, dur: 1 / 16 } },
        { type: 'NOOP', payload: { time: 4 / 16 } }
      ]
    }
    expect(arpeg({ patt: 'du' }, score)).toMatchObject(expScore)
  })

  test('can arpeggiate down & up, repeating bottom note', () => {
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 73, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 76, dur: 1 / 4 } },
        { type: 'NOOP', payload: { time: 1 / 4 } }
      ]
    }
    let expScore = {
      actions: [
        { type: 'NOTE', payload: { time: 0 / 16, nn: 76, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 1 / 16, nn: 73, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 2 / 16, nn: 69, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 3 / 16, nn: 69, dur: 1 / 16 } },
        { type: 'NOOP', payload: { time: 4 / 16 } }
      ]
    }
    expect(arpeg({ patt: 'DU' }, score)).toMatchObject(expScore)
  })

  test('can play arpeggio at different octaves', () => {
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 73, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4 } },
        { type: 'NOOP', payload: { time: 1 / 4 } }
      ]
    }
    let expScore = {
      actions: [
        { type: 'NOTE', payload: { time: 0 / 16, nn: 81, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 1 / 16, nn: 85, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 2 / 16, nn: 93, dur: 1 / 16 } },
        { type: 'NOTE', payload: { time: 3 / 16, nn: 97, dur: 1 / 16 } },
        { type: 'NOOP', payload: { time: 4 / 16 } }
      ]
    }
    expect(arpeg({ patt: ['u1', 'u2'] }, score)).toMatchObject(expScore)
  })

  test('should include attributes of matched chord note', () => {
    let score = {
      actions: [
        { type: 'NOTE', payload: { time: 0, nn: 73, dur: 1 / 4 } },
        { type: 'NOTE', payload: { time: 0, nn: 69, dur: 1 / 4, foo: 'bar' } },
        { type: 'NOTE', payload: { time: 0, nn: 76, dur: 1 / 4 } },
        { type: 'NOOP', payload: { time: 1 / 4 } }
      ]
    }
    let expScore = {
      actions: [
        {
          type: 'NOTE',
          payload: { time: 0 / 8, nn: 69, dur: 1 / 8, foo: 'bar' }
        },
        { type: 'NOTE', payload: { time: 1 / 8, nn: 73, dur: 1 / 8 } },
        { type: 'NOOP', payload: { time: 2 / 8 } }
      ]
    }
    expect(arpeg({ dur: 1 / 8 }, score)).toMatchObject(expScore)
  })
})
