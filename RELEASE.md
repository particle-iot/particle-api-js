# Releasing a new version

- `npm version <major | minor | patch>`

This builds the distribution file `particle.js.min` and generates the
API documentation. Before the command finishes, update `CHANGELOG.md`.

- `git push && git push --tags`

- `npm publish`

- Create a release on GitHub with the notes from the `CHANGELOG.md`

