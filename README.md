# particle-api-js
JS Library for the Particle API

## Installation
**WARNING** This package is in the very early stages of development
and should not be used in production environments.
```shell
# babel-runtime is required by particle-api-js
npm install --save babel-runtime
npm install --save @particle/api
```

## Usage
```javascript
var Particle = require('@particle/api');
var particle = new Particle();

particle.login({username:"example@example.com", password:"no more secrets"})
  .then(function(token){
    return particle.listDevices({auth:token.access_token});
  }).then(function(devices){
    console.log(devices);
  });
```

## Development
This library utilizes JavaScript language features made available through the power of babel. It is strongly recommended that you install babel globally via npm like so:

`npm install -g babel`

For more information on how to use babel in your existing tool chain, please visit https://babeljs.io/docs/setup/
