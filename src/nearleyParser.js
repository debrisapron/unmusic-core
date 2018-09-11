const nearley = require("nearley");
const grammar = require("./grammar");

const parse = str => {
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  parser.feed(str);
  const parsings = parser.results;
  if (parsings.length > 1) {
    throw new Error("Syntax error in sequence: combination is ambiguous");
  }
  return parsings[0].filter(x => x);
};

module.exports = { parse };
