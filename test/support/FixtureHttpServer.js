// Serve files from the fixture folder
import express from 'express';
import * as fixtures from '../fixtures';

export default class FixtureHttpServer {
	constructor() {
		this.app = express();
		this.app.get(`/:filename`, (req, res) => {
			res.writeHead(200, {'Content-Type': 'application/octet-stream' });
			res.end(fixtures.read(req.params['filename']), 'binary');
		});
	}

	// Call in a before() test hook
	listen() {
		return new Promise(fulfill => {
			this.server = this.app.listen(0, fulfill);
		});
	}

	url() {
		return `http://localhost:${this.server.address().port}`;
	}
}
