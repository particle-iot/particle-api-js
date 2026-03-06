# particle-api-js
JS Library for the Particle Cloud API for Node.js and the browser

[![Build Status](https://circleci.com/gh/particle-iot/particle-api-js.svg?style=shield)](https://app.circleci.com/pipelines/github/particle-iot/particle-api-js)

[Installation](#installation) | [Development](#development)  | [Conventions](#conventions) | [Docs](#docs--resources) | [Examples](#examples) | [Building](#building) | [Releasing](#releasing) | [License](#license)

## TypeScript Support

`particle-api-js` is written in TypeScript and ships with full type declarations. All methods return fully typed responses — no casting needed:

```typescript
import Particle from 'particle-api-js';
import type { DeviceInfo, LoginResponse, JSONResponse } from 'particle-api-js';

const particle = new Particle({ auth: 'your-token' });

// Response body is fully typed — no casting needed
const response = await particle.getDevice({ deviceId: 'abc123' });
console.log(response.body.name);  // string — fully typed as DeviceInfo

// Login response
const loginResponse = await particle.login({ username: 'user@example.com', password: 'pass' });
const token = loginResponse.body.access_token;  // string
```

All request option types and response types are exported from the package:

```typescript
import type { GetDeviceOptions, ListDevicesOptions, JSONResponse } from 'particle-api-js';
```

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

<details id="develop-testing">
<summary><b>Testing Guide</b></summary>

### Running Tests

```bash
npm test              # lint + typecheck + unit tests
npm run test:unit     # unit tests only
npm run test:watch    # unit tests in watch mode
npm run test:browser  # browser tests via karma
npm run coverage      # unit tests with coverage report
```

The `Agent` integration tests ([source](./test/Agent.integration.ts)) depend on a real HTTP API backend and a valid Particle access token. Set environment variables to avoid test failures:

```bash
PARTICLE_API_BASE_URL=<url> PARTICLE_API_TOKEN=<token> npm test
```

### Test Structure

- All test files are TypeScript (`.spec.ts`, `.test.ts`, `.integration.ts`) in the `test/` directory
- Tests use `import` syntax — compiled output uses `require()` via `module: "commonjs"` in `tsconfig.json`
- Test runner: [mocha](https://mochajs.org/) with [tsx](https://github.com/privatenumber/tsx) for direct `.ts` execution (no pre-compilation needed)
- Assertions: [chai](https://www.chaijs.com/) (`expect` style) + [chai-subset](https://github.com/debitoor/chai-subset) for partial matching + [sinon-chai](https://github.com/domenic/sinon-chai) for spy/stub assertions + [chai-as-promised](https://github.com/domenic/chai-as-promised) for promise assertions
- Mocking: [sinon](https://sinonjs.org/)

### Writing a New Test

1. Create a file in `test/` following the naming convention: `<Module>.spec.ts`
2. Import the test setup and modules:

```typescript
import { sinon, expect } from './test-setup';
import MyModule from '../src/MyModule';
```

3. Use `describe`/`it` blocks with `expect` assertions:

```typescript
describe('MyModule', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('does something', () => {
        const result = new MyModule();
        expect(result.value).to.equal('expected');
    });
});
```

4. For partial object matching, use `containSubset`:

```typescript
expect(result).to.containSubset({
    method: 'get',
    uri: '/v1/devices'
});
```

5. Run your tests: `npm run test:unit`

### Key Conventions

- Always import from `../src/<Module>` (not `../lib/src/<Module>`)
- Use `sinon.restore()` in `afterEach` to clean up stubs
- Use `FakeAgent` (in `test/FakeAgent.ts`) for mocking HTTP requests in Particle API tests
- Avoid `any` and `unknown` types in test files

</details>

<details id="develop-run-locally">
<summary><b>How to write scripts that execute against local code changes?</b></summary>
<p>

Source code lives in the `./src` directory and is built for release via the `npm run build` command. To create a simple script file to test your changes, follow these steps:

1. create a `js` file on your local machine: `touch my-api-test.js` (somewhere outside of the root of this repo)
2. within your test `js` file, init the api client like so:

```js
const ParticleAPI = require('./path/to/particle-api-js'); // Make sure to substitute to correct path
const api = new ParticleAPI();
```

3. add in any api calls, etc required to validate you changes

```js
const devices = await api.listDevices({ auth: '<particle-auth-token>' });
console.log('MY DEVICES:', devices);
```

4. run it: `node ./path/to/my-api-test.js`

_NOTE: Requiring the root directory works via the `main` field specified in Particle API JS' `package.json` file ([docs](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#main))_ 


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
* test files live in the `test/` directory and are named like `*.spec.ts`, `*.test.ts`, or `*.integration.ts`
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
$ npm run build
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
