import should from 'should'; // monkeypatch the world~!1

import Particle from '../src/Particle';
import Defaults from '../src/Defaults';
import Client from '../src/Client';
import { createServer } from 'http';
import sinon from 'sinon';
import EventStream from '../src/EventStream';
import FakeAgent from './FakeAgent';

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
	accountInfo : { first_name: 'John', last_name: 'Scully', business_account: true, company_name: 'Apple Inc.' },
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
	responseTopic: 'topic',
	responseTemplate: 'template',
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
			api.agent = new FakeAgent();
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
				return api.createUser(props).then(( results ) => {
					results.should.eql({
						method: 'post',
						uri: '/v1/users',
						auth: undefined,
						data: {
							username: props.username,
							password: props.password,
							account_info: props.accountInfo
						}
					});
				});
			});
		});
		describe('.resetPassword', () => {
			it('sends request', () => {
				return api.resetPassword(props).then(({ data }) => {
					data.username.should.equal(props.username);
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
					results.data.should.be.instanceOf(Object);
					results.data.id.should.equal(props.deviceId);
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
					files.should.have.property('app.ino').and.be.ok;
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
					files.should.have.property('app.ino').and.be.ok;
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
			it('requests a product\'s event without an org provided', () => {
				return api.getEventStream({ product: 'test-product'}).then(({ uri }) => {
					uri.should.endWith('v1/products/test-product/events');
				});
			});
			it('requests a product\'s named event without an org provided', () => {
				return api.getEventStream({ product: 'test-product', name: 'foo'}).then(({ uri }) => {
					uri.should.endWith('v1/products/test-product/events/foo');
				});
			});
			it('requests product\'s device events', () => {
				return api.getEventStream({ product: 'test-product', deviceId: props.deviceId }).then(({ uri }) => {
					uri.should.endWith(`v1/products/test-product/devices/${props.deviceId}/events`);
				});
			});
			it('requests product\'s device named events', () => {
				return api.getEventStream({ product: 'test-product', deviceId: props.deviceId, name: 'foo' }).then(({ uri }) => {
					uri.should.endWith(`v1/products/test-product/devices/${props.deviceId}/events/foo`);
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
					data.responseTemplate.should.equal(props.responseTemplate);
					data.responseTopic.should.equal(props.responseTopic);
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
				return api.setUserInfo({ auth: 'X', stripeToken: '123ABCD', accountInfo: {first_name: 'John', last_name: 'Scully'} }).then((results) => {
					results.should.eql({
						method: 'put',
						uri: '/v1/user',
						auth: 'X',
						data: {
							stripe_token: '123ABCD',
							account_info: {first_name: 'John', last_name: 'Scully'}
						}
					});

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
		describe('.listLibraries', () => {
			it('generates request', () => {
				return api.listLibraries({ auth: 'X' }).then((results) => {
					results.uri.should.equal('/v1/libraries');
					results.auth.should.equal('X');
				});
			});
			it('forwards query parameters', () => {
				return api.listLibraries({
					auth: 'X',
					page: 3,
					filter: 'abc',
					sort: 'name',
					architectures:[ 'spark-core', 'particle-photon' ],
					category: 'Other'
				}).then((results) => {
					results.query.should.eql({
						page: 3,
						limit: undefined,
						filter: 'abc',
						excludeScopes: undefined,
						sort: 'name',
						scope: undefined,
						architectures: 'spark-core,particle-photon',
						category: 'Other'
					});
				});
			});
		});
		describe('.getLibrary', () => {
			it('generates request', () => {
				return api.getLibrary({ name: 'mylib', auth: 'X' }).then((results) => {
					results.should.match({
						uri: '/v1/libraries/mylib',
						auth: 'X'
					});
				});
			});
			it('forwards query parameters', () => {
				return api.getLibrary({
					name: 'mylib',
					auth: 'X',
					version: '1.2.0'
				}).then((results) => {
					results.query.should.eql({
						version: '1.2.0'
					});
				});
			});
		});
		describe('.getLibraryVersions', () => {
			it('generates request', () => {
				return api.getLibraryVersions({ name: 'mylib', auth: 'X' }).then((results) => {
					results.should.match({
						uri: '/v1/libraries/mylib/versions',
						auth: 'X'
					});
				});
			});
			it('forwards query parameters', () => {
				return api.getLibraryVersions({
					name: 'mylib',
					auth: 'X',
					page: 3
				}).then((results) => {
					results.query.should.eql({
						page: 3,
						limit: undefined
					});
				});
			});
		});
		describe('.contributeLibrary', () => {
			it('generates request', () => {
				const archive = new Buffer('tarball');

				return api.contributeLibrary({
					archive: archive,
					auth: 'X'
				}).then((results) => {
					results.should.match({
						method: 'post',
						uri: '/v1/libraries',
						auth: 'X'
					});
				});
			});
		});
		describe('.publishLibrary', () => {
			it('generates request', () => {
				const name = 'noname';
				return api.publishLibrary({
					name,
					auth: 'X'
				}).then((results) => {
					results.should.match({
						method: 'patch',
						uri: '/v1/libraries/noname',
						auth: 'X',
						data: {
							visibility: 'public'
						}
					});
				});
			});
		});
		describe('.deleteLibrary', () => {
			it('generates request', () => {
				return api.deleteLibrary({
					name: 'mylib',
					auth: 'X',
					force: 'xyz'
				}).then((results) => {
					results.should.match({
						method: 'delete',
						uri: '/v1/libraries/mylib',
						auth: 'X',
						data: {
							force: 'xyz'
						}
					});
				});
			});
		});
	});

	describe('.client', () => {
		it('creates a client', (done) => {
			api.client().should.be.instanceOf(Client);
			done();
		});
		it('passes the api', (done) => {
			api.client().api.should.equal(api);
			done();
		});
	});
});
