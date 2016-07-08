var Particle = require('./lib/Particle.js');
var fs = require('fs');

//var particle = new Particle();
//var particle = new Particle({baseUrl: "http://localhost:9090"});
var particle = new Particle({baseUrl: "https://api.staging.particle.io"});
//var TOK = "6a2aa0d65a93652b475de0c0b734d9f02e32ec6b";
var TOK = "cf3fce66c7d84ee4ad228641680d4bfba9f63c00"; // staging
//var promise = particle.listLibraries({ auth: TOK, query: "foo" });
//var promise = particle.resetPassword({ username: "jvanier@gmail.com" });
//var promise = particle.createUser({ username: "test123", password: "de0c0b734d9f02e32ec6b" });
//var promise = particle.getLibraryFiles({ name: "neopixel", auth: TOK });

//var promise = particle.login({ username: "foo", password: "bar"});
// var promise = particle.claimDevice({deviceId: '123', auth: TOK });
//var promise = particle.flashDevice({ deviceId: '123', files: { 'test.ino': 'test.ino' }, auth: TOK });

/*var client = particle.client({ auth: TOK });
client.libraries().then(function (libraries) {
  console.log(JSON.stringify(libraries));
}).catch(function(err) {
  console.error(JSON.stringify(err));
});*/

//promise = particle.listLibraries({ auth: TOK });
promise = particle.listDevices({ auth: TOK });
promise.then(function(response) {
  console.log(JSON.stringify(response.body));
}).catch(function(err) {
  console.error(JSON.stringify(err));
});
