const assert = require("node:assert/strict");
const grammar = require("../syntaxes/sema.tmLanguage.json");

function matches(pattern, value) {
  return new RegExp(pattern).test("(" + value + ")");
}

const numberPattern = grammar.repository.number.match;
for (const value of [
  "+2e3",
  "1/2",
  "3+4i",
  "+i",
  "#xFF",
  "#e#xFF",
  "#x#e1F",
]) {
  assert(matches(numberPattern, value), "numeric literal not matched: " + value);
}
assert(!matches(numberPattern, "0x1F"), "unsupported 0x prefix was matched");

const canonicalPattern = grammar.repository.builtin.patterns.at(-1).match;
for (const name of [
  "bytes/length",
  "async/with-timeout",
  "path/canonicalize",
  "db/open",
  "workflow/mcp-handle",
]) {
  assert(matches(canonicalPattern, name), "documented symbol not matched: " + name);
}

// Legacy Scheme-style names and arrow conversions are still bound at runtime
// (AGENTS.md decision 24 keeps them), but they are absent from
// sema-docs/builtin_docs.generated.json, so a grammar generated only from that
// file silently drops them. Pin a sample so the omission cannot come back.
for (const name of [
  "string-append",
  "string-length",
  "string-ref",
  "substring",
  "caddr",
  "char->integer",
  "integer->char",
  "string->symbol",
  "symbol->string",
  "keyword->string",
  "utf8->string",
  "char-alphabetic?",
  "path/basename",
  "path/dirname",
  "path/ext",
]) {
  assert(matches(canonicalPattern, name), "legacy alias not matched: " + name);
}

// Undocumented but bound builtins, found by comparing the runtime against the
// generated docs.
for (const name of [
  "i64-array?",
  "i64-array/length",
  "i64-array/set!",
  "stream/writable?",
  "time/now-ms",
]) {
  assert(
    matches(canonicalPattern, name),
    "undocumented builtin not matched: " + name,
  );
}

// A bare prefix of a builtin must not match: the trailing delimiter lookahead
// is what stops `strin` colouring as `string-append`.
for (const value of ["strin", "cad", "i64-arra"]) {
  assert(!matches(canonicalPattern, value), "prefix wrongly matched: " + value);
}

for (const name of ["policy/without", "llm/with-budget", "with-open"]) {
  assert(
    matches(grammar.repository["special-form"].match, name),
    "special form not matched: " + name,
  );
}

console.log("Sema syntax grammar checks passed");
