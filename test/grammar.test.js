const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const test = require('node:test')
const oniguruma = require('vscode-oniguruma')
const textmate = require('vscode-textmate')

let grammar

test.before(async () => {
  const wasm = await fs.readFile(require.resolve('vscode-oniguruma/release/onig.wasm'))
  await oniguruma.loadWASM(wasm.buffer)
  const registry = new textmate.Registry({
    onigLib: Promise.resolve({
      createOnigScanner: patterns => new oniguruma.OnigScanner(patterns),
      createOnigString: value => new oniguruma.OnigString(value),
    }),
    loadGrammar: async scopeName => {
      assert.equal(scopeName, 'source.sema')
      const source = await fs.readFile(path.join(__dirname, '..', 'syntaxes', 'sema.tmLanguage.json'), 'utf8')
      return textmate.parseRawGrammar(source, 'sema.tmLanguage.json')
    },
  })
  grammar = await registry.loadGrammar('source.sema')
})

function scopesFor(source, text) {
  const tokens = grammar.tokenizeLine(source).tokens
  const start = source.indexOf(text)
  const end = start + text.length
  return tokens.filter(token => token.startIndex < end && token.endIndex > start)
}

test('scopes complete regex literals as string.regexp.sema', () => {
  for (const literal of ['#"\\d+"', '#"\\\\"', '#"\\"[^\\"]+\\""']) {
    const tokens = scopesFor(`(regex/match? ${literal} text)`, literal)
    assert.ok(tokens.length > 0, literal)
    assert.ok(tokens.every(token => token.scopes.includes('string.regexp.sema')), literal)
    assert.equal(tokens[0].startIndex, 14, literal)
    assert.equal(tokens.at(-1).endIndex, 14 + literal.length, literal)
  }
})

test('does not classify raw regex backslashes as string escapes', () => {
  const source = '(regex/match? #"\\d+" text)'
  const tokens = scopesFor(source, '\\d')
  assert.ok(tokens.every(token => !token.scopes.includes('constant.character.escape.sema')))
})

test('classifies every regex builtin', () => {
  for (const name of ['regex/match?', 'regex/match', 'regex/find-all', 'regex/replace', 'regex/replace-all', 'regex/split']) {
    const tokens = scopesFor(`(${name} #"x" text)`, name)
    assert.ok(tokens.some(token => token.scopes.includes('support.function.sema')), name)
  }
})
