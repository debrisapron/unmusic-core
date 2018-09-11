open Jest;
open ExpectJs;

describe("umscript parser", () =>
  test("can parse an umlang string", () => {
    let s = "C /16 x=1 >";
    /* let expected = [|
         ["NOTE", { type: "PITCH_CLASS", value: "C" }],
         ["SETTING", { param: "duration", value: 1 / 16 }],
         ["SETTING", { param: "x", value: 1 }],
         ["OCTAVE_CHANGE", 1]
       |]; */
    expect(Parser.parse(s)) |> toBeTruthy;
  })
);
