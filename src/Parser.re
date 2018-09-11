type nearleyParsing;

[@bs.module "./nearleyParser"] external parseRaw: string => array(nearleyParsing) = "parse";
/* type nearleyParsing =

   type noteType = PitchClass | Midi | Relative;

   type parsing =
     | Note(noteType, string) */

let parse = str => parseRaw(str);
