# particle-api-js
JS Library for the Particle Cloud API for Node.js and the browser

[![Build Status](https://circleci.com/gh/particle-iot/particle-api-js.svg?style=shield)](https://app.circleci.com/pipelines/github/particle-iot/particle-api-js)

[Installation](#installation) | [Development](#development)  | [Conventions](#conventions) | [Docs](#docs--resources) | [Examples](#examples) | [Building](#building) | [Releasing](#releasing) | [License](#license)

## Installation

`particle-api-js` is available from `npm` to use in Node.js, `bower` or jsDelivr CDN for use in the browser.

#### Npm
```
$ npm install particle-api-js
```

#### Bower
```
$ bower install particle-api-js
```

#### jsDelivr CDN
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/particle-api-js@8/dist/particle.min.js">
</script>
```

## Development

All essential commands are available at the root via `npm run <script name>` - e.g. `npm run lint`. To view the available commands, run: `npm run`

<details id="develop-run-tests">
<summary><b>How to run your tests</b></summary>
<p>

to run the tests:

`npm test`

to run the coverage:

`npm run coverage`

to run browser tests with [karma](https://karma-runner.github.io/latest/index.html) (make sure you have the [Firefox launcher](https://npmjs.org/browse/keyword/karma-launcher) installed):

`npm run test:browser`

</p>
</details>


<details id="develop-npm-scripts">
<summary><b>How to name npm scripts</b></summary>
<p>

npm scripts are the primary means of executing programmatic tasks (e.g. tests, linting, releasing, etc) within the repo. to view available scripts, run `npm run`.

when creating a new script, be sure it does not already exist and use the following naming convention:

`<category>:[<subcategory>]:[<action>]`

our standard categories include: `test`, `lint`, `build`, `clean`, `docs`, `package`, `dependencies`, and `release`. top-level scripts - e.g. `npm run clean` - will typically run all of its subcategories (e.g. `npm run clean:dist && npm run clean:tmp`).

`npm` itself includes special handling for `test` and `start` (doc: [1](https://docs.npmjs.com/cli/v6/commands/npm-test), [2](https://docs.npmjs.com/cli/v6/commands/npm-start)) amongst other [lifecycle scripts](https://docs.npmjs.com/cli/v7/using-npm/scripts#life-cycle-scripts) - use these to expose key testing and start-up commands.

sometimes your new script will be very similar to an existing script. in those cases, try to extend the existing script before adding another one.

</p>
</details>

## Conventions

* [npm scripts](https://docs.npmjs.com/misc/scripts) form the _developer's API_ for the repo and all of its packages - key orchestration commands should be exposed here
* document developer-facing process / tooling instructions in the [Development](#development) section
* plan to release your changes upon merging to `main` - refrain from merging if you cannot so you don't leave unpublished changes to others
* avoid making changes in files unrelated to the work you are doing so you aren't having to publish trivial updates
* test files live alongside their source files and are named like `*.test.js` or `*.spec.js`
* if the linter does not flag your code (error or warning), it's formatted properly
* avoid reformatting unflagged code as it can obscure more meaningful changes and increase the chance of merge conflicts
* todo comments include your last name and are formatted like: `TODO (mirande): <message>`
  

## Docs & Resources

First, read the [documentation for Particle API JS on the Documentation website.][docs-website] It contains examples to get started.

For more details, read the [API reference on GitHub.](docs/api.md)

## Examples

There [are many snippets of using Particle API JS on the Documentation website][docs-website] and some complete examples in the [GitHub examples directory.](/examples)

## Building

Make your changes to the files in the `src` directory, then from the project directory run:

```
$ npm run compile && npm run build
```

The `dist` directory will contain the compiled and minified files that can be included in your project.

Run tests to make sure your changes are good:

```
$ npm test
```

Update the API docs with your changes:

```
$ npm run docs
```

## Releasing

See the release process in the [RELEASE.md](RELEASE.md) file.

## License

Copyright &copy; 2016 Particle Industries, Inc. Released under the Apache 2.0 license. See [LICENSE](/LICENSE) for details.

[docs-website]: https://docs.particle.io/reference/javascript/
