@{%
  function str(data) {
    return data.join('')
  }
%}

SEQUENCE       -> TOKEN                         {% id %}
                | SEQUENCE _ TOKEN              {% (data) => data[0].concat(data[2]) %}

TOKEN          -> NOTE
                | TRIG
                | REST
                | OCTAVE_CHANGE
                | SETTING
                | CHORD_GROUP

NOTE           -> PITCH_CLASS                   {% (data) => ['NOTE', { type: 'PITCH_CLASS', value: data[0] }] %}
                | "M" INTEGER                   {% (data) => ['NOTE', { type: 'MIDI',        value: data[1] }] %}
                | INTEGER                       {% (data) => ['NOTE', { type: 'RELATIVE',    value: data[0] }] %}
PITCH_CLASS    -> [A-G] [b♭#♯]:?                {% (data) => str(data) %}

TRIG           -> IDENTIFIER                    {% (data) => ['TRIG', data[0]] %}

REST           -> "_":+                         {% (data) => ['REST', data[0].length] %}

OCTAVE_CHANGE  -> "<":+                         {% (data) => ['OCTAVE_CHANGE', parseInt('-' + data[0].length)] %}
                | ">":+                         {% (data) => ['OCTAVE_CHANGE', parseInt(data[0].length)] %}

SETTING        -> IDENTIFIER "=" VALUE          {% (data) => ['SETTING', { param: data[0],    value: data[2] }] %}
                | NOTE_VALUE                    {% (data) => ['SETTING', { param: 'duration', value: data[0] }] %}
VALUE          -> NOTE_VALUE                    {% id %}
                | STRING                        {% (data) => !isNaN(data[0]) ? parseFloat(data[0]) : data[0] %}
NOTE_VALUE     -> INTEGER "/" INTEGER           {% (data) => data[0] / data[2] %}
                | "/" INTEGER                   {% (data) => 1 / data[1] %}
                | INTEGER "/"                   {% id %}

CHORD_GROUP    -> "{" _:? CHORD_TOKENS _:? "}"  {% (data) => ['CHORD_GROUP', data[2]] %}
CHORD_TOKENS   -> CHORD_TOKEN                   {% id %}
                | CHORD_TOKENS _ CHORD_TOKEN    {% (data) => data[0].concat(data[2]) %}
CHORD_TOKEN    -> NOTE
                | SETTING
                | OCTAVE_CHANGE

IDENTIFIER     -> LCASE_LETTER STRING:?         {% (data) => str(data[0].concat(data[1])) %}
LCASE_LETTER   -> [a-z]
STRING         -> [a-zA-Z$_0-9.]:+              {% (data) => str(data[0]) %}
NUMBER         -> FLOAT
                | INTEGER
FLOAT          -> INTEGER "." [0-9]:+           {% (data) => parseFloat(str(data)) %}
INTEGER        -> [-+]:? [0-9]:+                {% (data) => parseInt((data[0] === '-' ? '-' : '') + str(data[1])) %}
_              -> [\s]:+                        {% () => null %}
