const should = require('should'); // monkeypatch the world~!1

import Particle from '../src/Particle';
import Defaults from '../src/Defaults';
import { createServer } from 'http';
import sinon from 'sinon';
import EventStream from '../src/EventStream';

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
	signal: '1',
	auth: 'X',
	files: {
		'app.ino': new Buffer('void() {}\nsetup() {}\n')
	},
	targetVersion: '0.4.7',
	requestType: 'GET',
	headers: {
		test: 'header'
	},
	query: {
		q: 'p'
	},
	form: {
		f: 'd'
	},
	json: {
		j: 'd'
	},
	webhookAuth: {
		username: 'u',
		password: 'p'
	},
	rejectUnauthorized: true
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
	beforeEach(() => {
		api = new Particle();
	});

	describe('operations', () => {
		beforeEach(() => {
			/**
			 * This replaces the underlying Particle#request method with one that
			 * resolves to the object given as the argument to the method called,
			 * allowing us to directly inspect the request as it would be sent.
			 * tl;dr ~ takes HTTP out of the picture and pretends we're the server.
			 */
			sinon.stub(api, '_request', (opts) => {
				return new Promise((resolve) => resolve(opts));
			});
		});

		describe('constructor', () => {
			it('sets the defaults', () => {
				Object.keys(Defaults).forEach((setting) => {
					api[setting].should.equal(Defaults[setting]);
				});
			});
		});
		describe('.login', () => {
			it('sends credentials', () => {
				return api.login(props).then(Common.expectCredentials);
			});
		});
		describe('.createUser', () => {
			it('sends credentials', () => {
				return api.createUser(props).then(({ data }) => {
					data.username.should.equal(props.username);
					data.password.should.equal(props.password);
				});
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
		describe('.listAccessTokens', () => {
			it('sends credentials', () => {
				return api.listAccessTokens(props).then(({ auth }) => {
					auth.username.should.equal(props.username);
					auth.password.should.equal(props.password);
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
				return api.renameDevice(props).then(({ data }) => {
					data.should.be.instanceOf(Object);
					data.name.should.equal(props.name);
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
				return api.changeProduct(props).then(({ data }) => {
					data.should.be.instanceOf(Object);
					data.product_id.should.equal(props.productId);
					data.update_after_claim.should.equal(props.shouldUpdate);
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
				return api.signalDevice(props).then(({ data }) => {
					data.should.be.instanceOf(Object);
					data.signal.should.equal(props.signal);
				});
			});
		});
		describe('.flashTinker', () => {
			it('generates request', () => {
				return api.flashTinker(props).then(Common.expectDeviceUrlAndToken);
			});
			it('sends proper data', () => {
				return api.flashTinker(props).then(({ data }) => {
					data.should.be.instanceOf(Object);
					data.app.should.equal('tinker');
				});
			});
		});
		describe('.flashDevice', () => {
			it('generates request', () => {
				return api.flashDevice(props).then(Common.expectDeviceUrlAndToken);
			});
			it('sends proper data', () => {
				return api.flashDevice(props).then(({ files, form }) => {
					form.should.be.instanceOf(Object);
					files.should.be.instanceOf(Object);
					files.should.have.property('file').and.be.ok;
					form.build_target_version.should.equal(props.targetVersion);
				});
			});
		});
		describe('.compileCode', () => {
			it('generates request', () => {
				return api.compileCode(props).then((results) => {
					results.auth.should.equal(props.auth);
				});
			});
			it('sends proper data', () => {
				return api.compileCode(props).then(({ files, form }) => {
					form.should.be.instanceOf(Object);
					files.should.be.instanceOf(Object);
					files.should.have.property('file').and.be.ok;
					form.build_target_version.should.equal(props.targetVersion);
				});
			});
		});
		describe('.sendPublicKey', () => {
			it('generates request', () => {
				return api.sendPublicKey(props).then(Common.expectDeviceUrlAndToken);
			});
			it('sends proper data', () => {
				return api.sendPublicKey(props).then(({ data }) => {
					data.should.be.instanceOf(Object);
					data.deviceID.should.equal(props.deviceId);
					data.publicKey.should.equal(props.key);
					data.filename.should.equal('particle-api');
					data.order.should.containEql('manual');
					data.algorithm.should.equal('rsa');
				});
			});
			it('works with buffer', () => {
				return api.sendPublicKey({
					deviceId: '1337',
					key: new Buffer(props.key),
				}).then(({ data }) => {
					data.publicKey.should.equal(props.key);
				});
			});
		});
		describe('.callFunction', () => {
			it('generates request', () => {
				return api.callFunction(props).then(Common.expectDeviceUrlAndToken);
			});
			it('sends proper data', () => {
				return api.callFunction(props).then(({ data }) => {
					data.should.be.instanceOf(Object);
					data.args.should.equal(props.argument);
				});
			});
		});
		describe('.getEventStream', () => {
			before(() => {
				sinon.stub(EventStream.prototype, 'connect', function connect() {
					return new Promise((resolve) => {
						resolve({ uri: this.uri });
					});
				});
			});

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
			it('requests org\'s events', () => {
				return api.getEventStream({ org: 'test-org' }).then(({ uri }) => {
					uri.should.endWith('v1/orgs/test-org/events');
				});
			});
			it('requests org\'s device events', () => {
				return api.getEventStream({ org: 'test-org', deviceId: props.deviceId }).then(({ uri }) => {
					uri.should.endWith(`v1/orgs/test-org/devices/${props.deviceId}/events`);
				});
			});
			it('requests org\'s device named events', () => {
				return api.getEventStream({ org: 'test-org', deviceId: props.deviceId, name: 'test' }).then(({ uri }) => {
					uri.should.endWith(`v1/orgs/test-org/devices/${props.deviceId}/events/test`);
				});
			});
			it('requests product\'s events', () => {
				return api.getEventStream({ org: 'test-org', product: 'test-product' }).then(({ uri }) => {
					uri.should.endWith('v1/orgs/test-org/products/test-product/events');
				});
			});
			it('requests product\'s named events', () => {
				return api.getEventStream({ org: 'test-org', product: 'test-product', name: 'test' }).then(({ uri }) => {
					uri.should.endWith('v1/orgs/test-org/products/test-product/events/test');
				});
			});
		});
		describe('.publishEvent', () => {
			it('sends proper data', () => {
				return api.publishEvent(props).then(({ data }) => {
					data.should.be.instanceOf(Object);
					data.name.should.equal(props.name);
					data.data.should.equal(props.data);
				});
			});
		});
		describe('.createWebhook', () => {
			it('creates for a single device', () => {
				return api.createWebhook(props).then(({ data }) => {
					data.should.be.instanceOf(Object);
					data.event.should.equal(props.name);
					data.url.should.equal(props.url);
					data.deviceid.should.equal(props.deviceId);
					data.query.should.equal(props.query);
					data.form.should.equal(props.form);
					data.json.should.equal(props.json);
					data.headers.should.equal(props.headers);
					data.auth.should.equal(props.webhookAuth);
					data.requestType.should.equal(props.requestType);
					data.rejectUnauthorized.should.equal(props.rejectUnauthorized);
				});
			});
			it('creates for user\'s devices', () => {
				return api.createWebhook({ deviceId: 'mine' }).then(({ data }) => {
					data.should.be.instanceOf(Object);
					data.mydevices.should.equal(true);
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
				return api.validatePromoCode({ auth: 'X', promoCode: '123ABCD' }).then((results) => {
					results.uri.should.be.instanceOf(String);
					results.auth.should.equal('X');
				});
			});
		});
		describe('.setUserInfo', () => {
			it('generates request', () => {
				return api.setUserInfo({ auth: 'X', stripeToken: '123ABCD' }).then((results) => {
					results.uri.should.be.instanceOf(String);
					results.auth.should.equal('X');
				});
			});
		});
		describe('.activateSIM', () => {
			it('generates request', () => {
				return api.activateSIM({ auth: 'X', countryCode: 'XX', promoCode: '123ABCD', iccid: '1234567890123456789' }).then((results) => {
					results.uri.should.be.instanceOf(String);
					results.auth.should.equal('X');
				});
			});
		});
		describe('.checkSIM', () => {
			it('generates request', () => {
				return api.checkSIM({ auth: 'X', iccid: '1234567890123456789' }).then((results) => {
					results.uri.should.be.instanceOf(String);
					results.auth.should.equal('X');
				});
			});
		});
	});

	describe('#request', () => {
		beforeEach(() => {
			server = createServer();
			server.listen(0);
		});
		it('generates request', (done) => {
			api.request({
				uri: `http://127.0.0.1:${ server.address().port }`,
				auth: 'X',
				data: { test: true },
				method: 'post',
			});
			server.once('request', (req, res) => {
				let body = '';
				req.headers.authorization.should.equal('Bearer X');
				req.method.should.equal('POST');
				req.on('data', (dat) => {
					body += dat;
				});
				req.on('end', () => {
					body.should.equal(JSON.stringify({ test: true }));
					done();
				});
				res.end();
			});
		});
		it('reports HTTP error', (done) => {
			api.request({
				uri: `http://127.0.0.1:${ server.address().port }`,
				auth: 'X',
				data: { test: true },
				method: 'post',
			}).then(() => {
				done(new Error('Server returned 400 error, but request succeeded'));
			}).catch((err) => {
				err.statusCode.should.equal(400);
				err.errorDescription.should.containEql('HTTP error 400 from http://127.0.0.1');
				done();
			}).catch(done);
			server.once('request', (req, res) => {
				res.writeHead(400);
				res.write(JSON.stringify({
					error: 'wat_error', error_description: 'WAT',
				}));
				res.end();
			});
		});
		it('reports network error', (done) => {
			api.request({
				uri: `http://127.0.0.1:${ server.address().port }`,
				auth: 'X',
				data: { test: true },
				method: 'post',
			}).then(() => {
				done(new Error('Network error occurred, but request succeeded'));
			}).catch(() => {
				done();
			});
			server.once('request', (req, res) => {
				res.socket.destroy();
			});
		});
	});
});
