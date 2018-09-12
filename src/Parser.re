type payload;

type nearleyParsing = (string, payload);

[@bs.module "./nearleyParser"]
external parseRaw : string => array(nearleyParsing) = "parse";

type noteKind =
  | PitchClass
  | Midi
  | Relative;

type parsing =
  | Note(noteKind, string)
  | Setting(string, float);

let noteKindFromString = str =>
  switch (str) {
  | "PITCH_CLASS" => Some(PitchClass)
  | "MIDI" => Some(Midi)
  | "RELATIVE" => Some(Relative)
  | _ => None
  };

let parse = str =>
  Array.to_list(parseRaw(str))
  |> List.map(nearleyParsing =>
       switch (nearleyParsing) {
       | ["NOTE", {kind: "PITCH_CLASS", value}] =>
         Note(noteKindFromString(kind), value)
       }
     );
