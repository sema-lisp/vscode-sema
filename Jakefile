# Jakefile — VS Code extension packaging/publishing (jakefile.dev).
#
# `@rooted` resolves relative paths against THIS repo so a workspace meta-repo can
# `@import "vscode-sema/Jakefile" as vscode` and run `vscode.package` from root.
@rooted

# File recipe: repackage the .vsix only when the sources/manifest change.
file sema.vsix: src/**/* package.json language-configuration.json syntaxes/*.json
    @command -v npx >/dev/null || { echo "npx not found — install Node.js" >&2; exit 1; }
    npm install
    npm run compile
    npx --yes @vscode/vsce package --no-git-tag-version --out sema.vsix

@group ext
@desc "Package the VS Code extension (.vsix)"
task package: [sema.vsix]
    echo "Packaged sema.vsix"

# vsce reads VSCE_PAT from the env; ovsx takes the token as a flag. Publishes to
# both the VS Marketplace and Open VSX, mirroring the CI publish workflow.
@group ext
@desc "Publish the VS Code extension to VS Marketplace + Open VSX"
@require VSCE_PAT OVSX_PAT
task publish: [package]
    @confirm "Publish the VS Code extension to VS Marketplace and Open VSX?"
    npx --yes @vscode/vsce publish --packagePath sema.vsix
    npx --yes ovsx publish sema.vsix -p $OVSX_PAT
