// In Node, exports the fs module. In the browser, exports undefined due to "./fs": false entry in package.json
module.exports = require('fs');
