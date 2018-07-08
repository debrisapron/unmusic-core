import * as actionHelpers from './actionHelpers'

export default function getScore(thing) {
  return thing.actions
    ? thing
    : actionHelpers.wrap(actionHelpers.get(thing))
}
