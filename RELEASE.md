# Releasing a new version

1. Merge your changes to master and be on `master`
2. Run `npm version <major|minor|patch>`
   1. This builds the distribution file `particle.js.min` and generates the
  API documentation. Before the command finishes, update `CHANGELOG.md`.
3. Push to origin `git push --follow-tags`
4. CircleCI will publish the npm package to the `latest` tag
5. Create a release on GitHub with the notes from the `CHANGELOG.md`
6. Point your project to the new version `npm install particle-api-js@latest`

- After updating major version, update the installation instructions in the [docs](https://github.com/particle-iot/docs/blob/master/src/content/reference/SDKs/javascript.md)
