type actionList = array('x);

[@bs.deriving abstract]
type score = {
  actions: actionList,
  config: 'x,
  loop: bool,
  tempo: float
};

[@bs.module "./actionHelpers"] external getActions : 'x => actionList = "get";
[@bs.module "./actionHelpers"] external wrapActions : actionList => score = "wrap";
[@bs.module "./actionHelpers"] external cleanActions : actionList => actionList = "clean";
[@bs.module "./actionHelpers"] external concatActionLists : actionList => actionList = "concat";

let concatScores = (scores: array(score)) : score =>
  scores
    |> Js.Array.map(getActions)
    |> concatActionLists
    |> cleanActions
    |> wrapActions;
