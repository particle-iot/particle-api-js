// Serve files from the fixture folder
const express = require('express');
const fixtures = require('../fixtures');


class FixtureHttpServer {
	constructor(){
		this.app = express();
		this.app.get('/:filename', (req, res) => {
			res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
			res.end(fixtures.read(req.params['filename']), 'binary');
		});
	}

	// Call in a before() test hook
	listen(){
		return new Promise(fulfill => {
			this.server = this.app.listen(0, fulfill);
		});
	}

	url(){
		return `http://localhost:${this.server.address().port}`;
	}
}

module.exports = FixtureHttpServer;
