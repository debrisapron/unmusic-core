enum ActionType {
  Noop = 'NOOP',
  Note = 'NOTE',
  Trig = 'TRIG'
}

export interface Action {
  type: ActionType
  payload: object
}

export interface Score {
  readonly actions: ReadonlyArray<Action>
}

// Parser types

export enum ParsingType {
  Setting = 'SETTING',
  OctaveChange = 'OCTAVE_CHANGE',
  ChordGroup = 'CHORD_GROUP'
}

interface Parsings extends Array<Parsing> {}

export type Parsing =
  | {
      type: ParsingType.Setting
      data: { param: string; value: any }
    }
  | {
      type: ParsingType.OctaveChange
      data: number
    }
  | {
      type: ParsingType.ChordGroup
      data: Parsings
    }

export interface ParserContext {
  time: number
  oct: number
  dur: number
  [propName: string]: any
}
