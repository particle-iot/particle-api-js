# particle-api-js
JS Library for the Particle Cloud API for Node.js and the browser

[![Build Status](https://travis-ci.org/spark/particle-api-js.svg?branch=master)](https://travis-ci.org/spark/particle-api-js)

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
<script type="text/javascript" src="//cdn.jsdelivr.net/particle-api-js/5/particle.min.js">
</script>
```

## Documentation

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


## License

Copyright &copy; 2016 Particle Industries, Inc. Released under the Apache 2.0 license. See [LICENSE](/LICENSE) for details.

[docs-website]: https://docs.particle.io/reference/javascript/
