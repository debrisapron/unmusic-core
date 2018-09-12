type payload;
type nearleyParsing = (string, payload);

[@bs.module "./nearleyParser"] external parseRaw: string => array(nearleyParsing) = "parse";
/* type nearleyParsing =

   type noteType = PitchClass | Midi | Relative;

   type parsing =
     | Note(noteType, string) */

let parse = str => Array.to_list(parseRaw(str)) |> List.map(nearleyParsing => nearleyParsing);
