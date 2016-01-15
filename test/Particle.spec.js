const should = require('should'); // monkeypatch the world~!1

import Particle from '../src/Particle';
import Defaults from '../src/Defaults';
import { createServer } from 'http';
import sinon from 'sinon';

let api;
let server;

const props = {
	url: 'http://www.zombo.com/',
	password: 'test-password',
	data: { sentient: true },
	username: 'test-user',
	argument: 'noThanks',
	shouldUpdate: 'duh',
	name: 'specialName',
	productId: '9001',
	deviceId: '1337',
	key: 'c1a55e5',
	event: 'main',
	token: 'Y',
	signal: 1,
	auth: 'X',
};

class Common {

	static expectCredentials({ form }) {
		form.username.should.equal(props.username);
		form.password.should.equal(props.password);
	}
	static expectDeviceUrlAndToken(results) {
		results.uri.should.containEql(props.deviceId);
		results.auth.should.equal(props.auth);
	}
}

describe('ParticleAPI', () => {
	before(() => {
		/**
		 * This replaces the underlying Particle#request method with one that
		 * resolves to the object given as the argument to the method called,
		 * allowing us to directly inspect the request as it would be sent.
		 * tl;dr ~ takes HTTP out of the picture and pretends we're the server.
		 */
		sinon.stub(Particle, 'request', (opts) => {
			return new Promise((resolve) => { resolve(opts); });
		});
	});

	beforeEach(() => { api = new Particle(); });

	describe('constructor', () => {
		it('sets the defaults', () => {
			Object.keys(Defaults).forEach((setting) => {
				api[setting].should.equal(Defaults[setting]);
			});
		});
	});
	describe('.url', () => {
		it('forms correct url', () => {
			const testUrl = api.url('x', 'y');
			testUrl.should.equal(`${ Defaults.baseUrl }x/y`);
		});
	});
	describe('.login', () => {
		it('sends credentials', () => {
			return api.login(props).then(Common.expectCredentials);
		});
	});
	describe('.createUser', () => {
		it('sends credentials', () => {
			return api.createUser(props).then(Common.expectCredentials);
		});
	});
	describe('.removeAccessToken', () => {
		it('sends credentials', () => {
			return api.removeAccessToken(props).then(({ auth }) => {
				auth.username.should.equal(props.username);
				auth.password.should.equal(props.password);
			});
		});
		it('generates request', () => {
			return api.removeAccessToken(props).then((results) => {
				results.uri.should.endWith(props.token);
			});
		});
	});
	describe('.listDevices', () => {
		it('generates request', () => {
			return api.listDevices({ auth: 'X' }).then((results) => {
				results.uri.should.be.instanceOf(String);
				results.auth.should.equal('X');
			});
		});
	});
	describe('.getDevice', () => {
		it('generates request', () => {
			return api.getDevice(props).then(Common.expectDeviceUrlAndToken);
		});
	});
	describe('.claimDevice', () => {
		it('sends credentials', () => {
			return api.claimDevice(props).then((results) => {
				results.form.should.be.instanceOf(Object);
				results.form.id.should.equal(props.deviceId);
				results.auth.should.equal(props.auth);
			});
		});
	});
	describe('.removeDevice', () => {
		it('generates request', () => {
			return api.removeDevice(props).then(Common.expectDeviceUrlAndToken);
		});
	});
	describe('.renameDevice', () => {
		it('generates request', () => {
			return api.renameDevice(props).then(Common.expectDeviceUrlAndToken);
		});
		it('sends proper data', () => {
			return api.renameDevice(props).then(({ form }) => {
				form.should.be.instanceOf(Object);
				form.name.should.equal(props.name);
			});
		});
	});
	describe('.getClaimCode', () => {
		it('generates request', () => {
			return api.getClaimCode({ auth: 'X' }).then((results) => {
				results.auth.should.equal('X');
			});
		});
	});
	describe('.changeProduct', () => {
		it('generates request', () => {
			return api.changeProduct(props).then(Common.expectDeviceUrlAndToken);
		});
		it('sends proper data', () => {
			return api.changeProduct(props).then(({ form }) => {
				form.should.be.instanceOf(Object);
				form.product_id.should.equal(props.productId);
				form.update_after_claim.should.equal(props.shouldUpdate);
			});
		});
	});
	describe('.getVariable', () => {
		it('generates request', () => {
			return api.getVariable(props).then(Common.expectDeviceUrlAndToken);
		});
		it('sends proper data', () => {
			return api.getVariable(props).then(({ uri }) => {
				uri.should.containEql(props.name);
			});
		});
	});
	describe('.signalDevice', () => {
		it('generates request', () => {
			return api.signalDevice(props).then(Common.expectDeviceUrlAndToken);
		});
		it('sends proper data', () => {
			return api.signalDevice(props).then(({ form }) => {
				form.should.be.instanceOf(Object);
				form.signal.should.equal(props.signal);
			});
		});
	});
	describe('.flashTinker', () => {
		it('generates request', () => {
			return api.flashTinker(props).then(Common.expectDeviceUrlAndToken);
		});
		it('sends proper data', () => {
			return api.flashTinker(props).then(({ form }) => {
				form.should.be.instanceOf(Object);
				form.app.should.equal('tinker');
			});
		});
	});
	describe('.sendPublicKey', () => {
		it('generates request', () => {
			return api.sendPublicKey(props).then(Common.expectDeviceUrlAndToken);
		});
		it('sends proper data', () => {
			return api.sendPublicKey(props).then(({ form }) => {
				form.should.be.instanceOf(Object);
				form.deviceID.should.equal(props.deviceId);
				form.publicKey.should.equal(props.key);
				form.filename.should.equal('particle-api');
				form.order.should.containEql('manual');
			});
		});
		it('works with buffer', () => {
			return api.sendPublicKey({
				deviceId: '1337',
				key: new Buffer(props.key),
			}).then(({ form }) => {
				form.publicKey.should.equal(props.key);
			});
		});
	});
	describe('.callFunction', () => {
		it('generates request', () => {
			return api.callFunction(props).then(Common.expectDeviceUrlAndToken);
		});
		it('sends proper data', () => {
			return api.callFunction(props).then(({ form }) => {
				form.should.be.instanceOf(Object);
				form.args.should.equal(props.argument);
			});
		});
	});
	describe('.getEventStream', () => {
		it('requests public events', () => {
			return api.getEventStream({ }).then(({ uri }) => {
				uri.should.endWith('events');
			});
		});
		it('requests all user events', () => {
			return api.getEventStream({ deviceId: 'mine' }).then(({ uri }) => {
				uri.should.endWith('devices/events');
			});
		});
		it('requests all named events', () => {
			return api.getEventStream({ name: 'test' }).then(({ uri }) => {
				uri.should.endWith('v1/events/test');
			});
		});
		it('requests all device events', () => {
			return api.getEventStream({ deviceId: '1337' }).then(({ uri }) => {
				uri.should.endWith('1337/events');
			});
		});
		it('requests user\'s named events', () => {
			return api.getEventStream({
				deviceId: 'mine',
				name: 'test',
			}).then(({ uri }) => {
				uri.should.endWith('devices/events/test');
			});
		});
		it('requests device\'s named events', () => {
			return api.getEventStream(props).then(({ uri }) => {
				uri.should.endWith(`${ props.deviceId }/events/${ props.name }`);
			});
		});
	});
	describe('.publishEvent', () => {
		it('sends proper data', () => {
			return api.publishEvent(props).then(({ form }) => {
				form.should.be.instanceOf(Object);
				form.name.should.equal(props.name);
				form.data.should.equal(props.data);
			});
		});
	});
	describe('.createWebhook', () => {
		it('creates for a single device', () => {
			return api.createWebhook(props).then(({ form }) => {
				form.should.be.instanceOf(Object);
				form.event.should.equal(props.name);
				form.url.should.equal(props.url);
				form.deviceid.should.equal(props.deviceId);
			});
		});
		it('creates for user\'s devices', () => {
			return api.createWebhook({ deviceId: 'mine' }).then(({ form }) => {
				form.should.be.instanceOf(Object);
				form.mydevices.should.equal(true);
			});
		});
	});
	describe('.deleteWebhook', () => {
		it('sends proper data', () => {
			return api.deleteWebhook({ hookId: 'captain' }).then(({ uri }) => {
				uri.should.endWith('webhooks/captain');
			});
		});
	});
	describe('.listWebhooks', () => {
		it('generates request', () => {
			return api.listWebhooks(props).then(({ auth }) => {
				auth.should.equal(props.auth);
			});
		});
	});
	describe('.listBuildTargets', () => {
		it('generates request', () => {
			return api.listBuildTargets(props).then(({ auth, query }) => {
				auth.should.equal(props.auth);
				should.not.exist(query);
			});
		});
		it('passes featured flag', () => {
			const params = { auth: props.auth, onlyFeatured: true };
			return api.listBuildTargets(params).then(({ auth, query }) => {
				auth.should.equal(props.auth);
				query.should.eql({ featured: true });
			});
		});
	});
	describe('.validatePromoCode', () => {
		it('generates request', () => {
			return api.validatePromoCode({ auth: 'X', promoCode: "123ABCD" }).then((results) => {
				results.uri.should.be.instanceOf(String);
				results.auth.should.equal('X');
			});
		});
	});
	describe('.setUserInfo', () => {
		it('generates request', () => {
			return api.setUserInfo({ auth: 'X', stripeToken: "123ABCD" }).then((results) => {
				results.uri.should.be.instanceOf(String);
				results.auth.should.equal('X');
			});
		});
	});
	describe('.activateSIM', () => {
		it('generates request', () => {
			return api.activateSIM({ auth: 'X', countryCode: "XX", promoCode: "123ABCD", iccid: "1234567890123456789" }).then((results) => {
				results.uri.should.be.instanceOf(String);
				results.auth.should.equal('X');
			});
		});
	});
	describe('.checkSIM', () => {
		it('generates request', () => {
			return api.checkSIM({ auth: 'X', iccid: "1234567890123456789" }).then((results) => {
				results.uri.should.be.instanceOf(String);
				results.auth.should.equal('X');
			});
		});
	});
	describe('#headers', () => {
		it('returns nothing', () => {
			const headers = Particle.headers();
			should.not.exist(headers);
		});
		it('returns Bearer token', () => {
			const headers = Particle.headers(props.auth);
			headers.should.be.eql({ Authorization: `Bearer ${ props.auth }`});
		});
		it('returns Basic auth', () => {
			const auth = { username: props.username, password: props.password };
			const str = new Buffer(`${ auth.username }:${ auth.password }`, 'utf8');
			const headers = Particle.headers(auth);
			headers.should.be.eql({
				Authorization: `Basic ${ str.toString('base64') }`,
			});
		});
	});
	describe('#request', () => {
		before(() => {
			Particle.request.restore();
		});
		beforeEach(() => {
			server = createServer();
			server.listen(0);
		});
		it('generates request', (done) => {
			Particle.request({
				uri: `http://127.0.0.1:${ server.address().port }`,
				auth: 'X',
				form: { test: true },
				method: 'post',
			});
			server.on('request', (req, res) => {
				let body = '';
				req.headers.authorization.should.equal('Bearer X');
				req.method.should.equal('POST');
				req.on('data', (dat) => { body += dat; });
				req.on('end', () => {
					body.should.equal(JSON.stringify({ test: true }));
					done();
				});
				res.end();
			});
		});
		it('reports HTTP error', (done) => {
			Particle.request({
				uri: `http://127.0.0.1:${ server.address().port }`,
				auth: 'X',
				form: { test: true },
				method: 'post',
			}).then(() => {
				should.fail('Server returned 400 error, but request succeeded');
				done();
			}).catch((err) => {
				err.code.should.equal(400);
				err.errorDescription.should.containEql('HTTP error 400 from http://127.0.0.1');
				done();
			});
			server.on('request', (req, res) => {
				res.writeHead(400);
				res.write(JSON.stringify({
					error: 'wat_error', error_description: 'WAT',
				}));
				res.end();
				done();
			});
		});
		it('reports network error', (done) => {
			Particle.request({
				uri: `http://127.0.0.1:${ server.address().port }`,
				auth: 'X',
				form: { test: true },
				method: 'post',
			}).then(() => {
				should.fail('Network error occurred, but request succeeded');
				done();
			}).catch(() => {
				done();
			});
			server.on('request', (req, res) => {
				res.end();
			});
		});
	});
});
