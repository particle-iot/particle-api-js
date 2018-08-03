import should from 'should'; // monkeypatch the world~!1

import Particle from '../src/Particle';
import Defaults from '../src/Defaults';
import Client from '../src/Client';
import { createServer } from 'http';
import EventStream from '../src/EventStream';
import FakeAgent from './FakeAgent';
import {sinon, expect} from './test-setup';

let api;
let server;

const props = {
	url: 'http://www.zombo.com/',
	password: 'test-password',
	currentPassword: 'test-password',
	data: { sentient: true },
	isPrivate: true,
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
	body: '{{data}}',
	responseTopic: 'topic',
	responseTemplate: 'template',
	webhookAuth: {
		username: 'u',
		password: 'p'
	},
	rejectUnauthorized: true,
	noDefaults: true,
	hookId: 'hook-1234567890',
	integrationId: 'integration-1234567890',
	clientId: 'client-123',
	type: 'web',
	redirect_uri: 'https://example.com',
	scope: '',
	deviceName: 'test-device',
	page: 5,
	perPage: 50,
	sortAttr: 'deviceId',
	sortDir: 'asc',
	deny: false,
	deviceIds: ['abc', 'xyz'],
	development: false,
	notes: 'A fancy Photon',
	desiredFirmwareVersion: 42,
	flash: false,
	version: 42,
	title: 'prod',
	description: 'ready for production',
	file: new Buffer('ELF...'),
	country: 'RO',
	iccid: '1234567890',
	iccids: ['1234567890', '9876543210'],
	serialNumber: 'PH-123456',
	settings: {
		url: 'http://example.com',
	},
	otp: '123456',
	mfaToken: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
};

const product = 'ze-product-v1';

const propsWithProduct = Object.assign({ product }, props);

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
		describe('trackingIdentity', () => {
			const context = { tool: { name: 'cli', version:'1.2.3' } };
			it('full', () => {
				return api.trackingIdentity({auth: 'X', full: true, context})
					.then((req) => {
						expect(req).to.have.property('uri').eql('/v1/user/identify');
						expect(req).to.have.property('method').eql('get');
						expect(req).to.have.property('query').eql(undefined);
						expect(req).to.have.property('context').eql(context);
						expect(req).to.have.property('auth').eql('X');
					});
			});
			it('id only', () => {
				return api.trackingIdentity().then(req => {
					expect(req).to.have.property('uri').eql('/v1/user/identify');
					expect(req).to.have.property('method').eql('get');
					expect(req).to.have.property('context').eql({});
					expect(req).to.have.property('query').eql({tracking:1});
				});
			});
		});
		describe('.login', () => {
			it('sends credentials', () => {
				return api.login(props).then(Common.expectCredentials);
			});
		});
		describe('.loginAsClientOwner', () => {
			it('sends client ID and secret', () => {
				let clientApi = new Particle({
					clientId: 'foo',
					clientSecret: 'bar'
				});
				clientApi.agent = new FakeAgent();
				return clientApi.loginAsClientOwner({}).then(req => {
					expect(req.form).to.have.property('client_id').eql('foo');
					expect(req.form).to.have.property('client_secret').eql('bar');
					expect(req.form).to.have.property('grant_type').eql('client_credentials');
				});
			});
		});
		describe('.sendOtp', () => {
			it('sends request to oauth token endpoint to verify the user login', () => {
				return api.sendOtp(props).then((results) => {
					expect(results).to.have.property('method').eql('post');
					expect(results).to.have.property('uri').eql('/oauth/token');
					expect(results.form).to.have.property('otp').eql(props.otp);
					expect(results.form).to.have.property('mfa_token').eql(props.mfaToken);
				});
			});
		});
		describe('.enableMfa', () => {
			it('sends request to begin mfa enrollment', () => {
				return api.enableMfa(props).then((results) => {
					results.should.eql({
						method: 'get',
						uri: '/v1/user/mfa-enable',
						auth: props.auth,
						query: undefined,
						context: {},
					});
				});
			});
		});
		describe('.confirmMfa', () => {
			it('sends request to confirm mfa enrollment', () => {
				return api.confirmMfa(props).then((results) => {
					results.should.eql({
						method: 'post',
						uri: '/v1/user/mfa-enable',
						auth: props.auth,
						data: {
							otp: props.otp,
							mfa_token: props.mfaToken,
						},
						context: {},
					});
				});
			});
		});
		describe('.disableMfa', () => {
			it('sends request to disable mfa', () => {
				return api.disableMfa(props).then((results) => {
					results.should.eql({
						method: 'put',
						uri: '/v1/user/mfa-disable',
						auth: props.auth,
						data: {
							current_password: props.password,
						},
						context: {},
					});
				});
			});
		});
		describe('.createCustomer', () => {
			it('sends client ID and secret', () => {
				let clientApi = new Particle({
					clientId: 'foo',
					clientSecret: 'bar'
				});
				clientApi.agent = new FakeAgent();
				return clientApi.loginAsClientOwner({}).then(req => {
					expect(req.form).to.have.property('client_id').eql('foo');
					expect(req.form).to.have.property('client_secret').eql('bar');
					expect(req.form).to.have.property('grant_type').eql('client_credentials');
				});
			});
		});
		describe('.createUser', () => {
			it('sends credentials', () => {
				return api.createUser(props).then(( results ) => {
					results.should.eql({
						method: 'post',
						uri: '/v1/users',
						auth: undefined,
						context: {},
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
		describe('.deleteAccessToken', () => {
			it('sends request', () => {
				return api.deleteAccessToken(props).then((results) => {
					results.should.match({
						method: 'delete',
						uri: `/v1/access_tokens/${props.token}`,
						auth: {
							username: props.username,
							password: props.password
						}
					});
				});
			});
		});
		describe('.deleteCurrentAccessToken', () => {
			it('sends request', () => {
				return api.deleteCurrentAccessToken(props).then((results) => {
					results.should.match({
						method: 'delete',
						uri: '/v1/access_tokens/current',
						auth: props.auth,
					});
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
			describe('user scope', () => {
				it('generates request', () => {
					return api.listDevices(props).then((results) => {
						results.should.match({
							method: 'get',
							uri: '/v1/devices',
							auth: props.auth,
							query: undefined
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.listDevices(propsWithProduct).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/products/${product}/devices`,
							auth: props.auth,
							query: {
								deviceName: props.deviceName,
								page: props.page,
								per_page: props.perPage,
								sortAttr: props.sortAttr,
								sortDir: props.sortDir
							}
						});
					});
				});
			});
		});
		describe('.getDevice', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.getDevice(props).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/devices/${props.deviceId}`,
							auth: props.auth
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.getDevice(propsWithProduct).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/products/${product}/devices/${props.deviceId}`,
							auth: props.auth
						});
					});
				});
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
		describe('.addDeviceToProduct', () => {
			it('sends request', () => {
				return api.addDeviceToProduct(propsWithProduct).then((results) => {
					results.should.match({
						method: 'post',
						uri: `/v1/products/${product}/devices`,
						auth: props.auth,
						data: {
							id: props.deviceId
						}
					});
				});
			});
		});
		describe('.removeDevice', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.removeDevice(props).then((results) => {
						results.should.match({
							method: 'delete',
							uri: `/v1/devices/${props.deviceId}`,
							auth: props.auth
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.removeDevice(propsWithProduct).then((results) => {
						results.should.match({
							method: 'delete',
							uri: `/v1/products/${product}/devices/${props.deviceId}`,
							auth: props.auth,
							data: {
								deny: props.deny
							}
						});
					});
				});
			});
		});
		describe('.removeDeviceOwner', () => {
			it('generates request', () => {
				return api.removeDeviceOwner(propsWithProduct).then((results) => {
					results.should.match({
						method: 'delete',
						uri: `/v1/products/${product}/devices/${props.deviceId}/owner`,
						auth: props.auth
					});
				});
			});
		});
		describe('.renameDevice', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.renameDevice(props).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/devices/${props.deviceId}`,
							auth: props.auth,
							data: {
								name: props.name
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.renameDevice(propsWithProduct).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/devices/${props.deviceId}`,
							auth: props.auth,
							data: {
								name: props.name
							}
						});
					});
				});
			});
		});
		describe('.setDeviceNotes', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.setDeviceNotes(props).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/devices/${props.deviceId}`,
							auth: props.auth,
							data: {
								notes: props.notes
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.setDeviceNotes(propsWithProduct).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/devices/${props.deviceId}`,
							auth: props.auth,
							data: {
								notes: props.notes
							}
						});
					});
				});
			});
		});
		describe('.markAsDevelopmentDevice', () => {
			describe('without development parameter', () => {
				it('generates request', () => {
					const params = Object.assign({}, propsWithProduct, { development: undefined });
					return api.markAsDevelopmentDevice(params).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/devices/${props.deviceId}`,
							auth: props.auth,
							data: {
								development: true
							}
						});
					});
				});
			});
			describe('with development parameter', () => {
				it('generates request', () => {
					return api.markAsDevelopmentDevice(propsWithProduct).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/devices/${props.deviceId}`,
							auth: props.auth,
							data: {
								development: false
							}
						});
					});
				});
			});
		});
		describe('.lockDeviceProductFirmware', () => {
			it('generates request', () => {
				return api.lockDeviceProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						method: 'put',
						uri: `/v1/products/${product}/devices/${props.deviceId}`,
						auth: props.auth,
						data: {
							desired_firmware_version: props.desiredFirmwareVersion,
							flash: props.flash
						}
					});
				});
			});
		});
		describe('.unlockDeviceProductFirmware', () => {
			it('generates request', () => {
				return api.unlockDeviceProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						method: 'put',
						uri: `/v1/products/${product}/devices/${props.deviceId}`,
						auth: props.auth,
						data: {
							desired_firmware_version: null
						}
					});
				});
			});
		});
		describe('.updateDevice', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.updateDevice(props).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/devices/${props.deviceId}`,
							auth: props.auth,
							data: {
								name: props.name,
								notes: props.notes
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.updateDevice(propsWithProduct).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/devices/${props.deviceId}`,
							auth: props.auth,
							data: {
								name: props.name,
								notes: props.notes,
								development: props.development,
								desired_firmware_version: props.desiredFirmwareVersion,
								flash: props.flash
							}
						});
					});
				});
			});
		});
		describe('.provisionDevice', () => {
			it('generates request', () => {
				return api.provisionDevice(props).then((results) => {
					results.should.match({
						method: 'post',
						uri: '/v1/devices',
						auth: props.auth,
						data: {
							product_id: props.productId
						}
					});
				});
			});
		});
		describe('.getClaimCode', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.getClaimCode(props).then((results) => {
						results.should.match({
							method: 'post',
							uri: '/v1/device_claims',
							auth: props.auth,
							data: {
								iccid: props.iccid
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.getClaimCode(propsWithProduct).then((results) => {
						results.should.match({
							method: 'post',
							uri: `/v1/products/${product}/device_claims`,
							auth: props.auth,
							data: {
								iccid: props.iccid
							}
						});
					});
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
				});
			});
		});
		describe('.getVariable', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.getVariable(props).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/devices/${props.deviceId}/${props.name}`,
							auth: props.auth
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.getVariable(propsWithProduct).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/products/${product}/devices/${props.deviceId}/${props.name}`,
							auth: props.auth
						});
					});
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
			describe('user scope', () => {
				it('generates request', () => {
					return api.callFunction(props).then((results) => {
						results.should.match({
							method: 'post',
							uri: `/v1/devices/${props.deviceId}/${props.name}`,
							auth: props.auth,
							data: {
								args: props.argument,
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.callFunction(propsWithProduct).then((results) => {
						results.should.match({
							method: 'post',
							uri: `/v1/products/${product}/devices/${props.deviceId}/${props.name}`,
							auth: props.auth,
							data: {
								args: props.argument,
							}
						});
					});
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
			describe('user scope', () => {
				it('generates request', () => {
					return api.publishEvent(props).then((results) => {
						results.should.match({
							method: 'post',
							uri: '/v1/devices/events',
							auth: props.auth,
							data: {
								name: props.name,
								data: props.data,
								private: props.isPrivate
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.publishEvent(propsWithProduct).then((results) => {
						results.should.match({
							method: 'post',
							uri: `/v1/products/${product}/events`,
							auth: props.auth,
							data: {
								name: props.name,
								data: props.data,
								private: props.isPrivate
							}
						});
					});
				});
			});
		});
		describe('.createWebhook', () => {
			describe('user scope', () => {
				it('creates for a single device', () => {
					return api.createWebhook(props).then((results) => {
						results.should.match({
							method: 'post',
							uri: '/v1/webhooks',
							auth: props.auth,
							data: {
								event: props.name,
								url: props.url,
								deviceid: props.deviceId,
								responseTemplate: props.responseTemplate,
								responseTopic: props.responseTopic,
								query: props.query,
								form: props.form,
								json: props.json,
								headers: props.headers,
								auth: props.webhookAuth,
								requestType: props.requestType,
								rejectUnauthorized: props.rejectUnauthorized,
							}
						});
					});
				});
				it('creates for user\'s devices', () => {
					const params = Object.assign({}, props, { deviceId: 'mine' });
					return api.createWebhook(params).then((results) => {
						results.should.match({
							method: 'post',
							uri: '/v1/webhooks',
							auth: props.auth,
							data: {
								event: props.name,
								url: props.url,
								deviceid: undefined,
								responseTemplate: props.responseTemplate,
								responseTopic: props.responseTopic,
								query: props.query,
								form: props.form,
								json: props.json,
								body: props.body,
								headers: props.headers,
								auth: props.webhookAuth,
								requestType: props.requestType,
								rejectUnauthorized: props.rejectUnauthorized,
								noDefaults: props.noDefaults
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.createWebhook(propsWithProduct).then((results) => {
						results.should.match({
							method: 'post',
							uri: `/v1/products/${product}/webhooks`,
							auth: props.auth,
							data: {
								event: props.name,
								url: props.url,
								deviceid: props.deviceId,
								responseTemplate: props.responseTemplate,
								responseTopic: props.responseTopic,
								query: props.query,
								form: props.form,
								json: props.json,
								body: props.body,
								headers: props.headers,
								auth: props.webhookAuth,
								requestType: props.requestType,
								rejectUnauthorized: props.rejectUnauthorized,
								noDefaults: props.noDefaults
							}
						});
					});
				});
			});
		});
		describe('.deleteWebhook', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.deleteWebhook(props).then((results) => {
						results.should.match({
							method: 'delete',
							uri: `/v1/webhooks/${props.hookId}`,
							auth: props.auth,
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.deleteWebhook(propsWithProduct).then((results) => {
						results.should.match({
							method: 'delete',
							uri: `/v1/products/${product}/webhooks/${props.hookId}`,
							auth: props.auth,
						});
					});
				});
			});
		});
		describe('.listWebhooks', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.listWebhooks(props).then((results) => {
						results.should.match({
							method: 'get',
							uri: '/v1/webhooks',
							auth: props.auth,
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.listWebhooks(propsWithProduct).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/products/${product}/webhooks`,
							auth: props.auth,
						});
					});
				});
			});
		});
		describe('.createIntegration', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.createIntegration(props).then((results) => {
						results.should.match({
							method: 'post',
							uri: '/v1/integrations',
							auth: props.auth,
							data: {
								event: props.event,
								deviceid: props.deviceId,
								url: props.settings.url,
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.createIntegration(propsWithProduct).then((results) => {
						results.should.match({
							method: 'post',
							uri: `/v1/products/${product}/integrations`,
							auth: props.auth,
							data: {
								event: props.event,
								deviceid: props.deviceId,
								url: props.settings.url,
							}
						});
					});
				});
			});
		});
		describe('.editIntegration', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.editIntegration(props).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/integrations/${props.integrationId}`,
							auth: props.auth,
							data: {
								event: props.event,
								deviceid: props.deviceId,
								url: props.settings.url,
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.editIntegration(propsWithProduct).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/integrations/${props.integrationId}`,
							auth: props.auth,
							data: {
								event: props.event,
								deviceid: props.deviceId,
								url: props.settings.url,
							}
						});
					});
				});
			});
		});
		describe('.deleteIntegration', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.deleteIntegration(props).then((results) => {
						results.should.match({
							method: 'delete',
							uri: `/v1/integrations/${props.integrationId}`,
							auth: props.auth,
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.deleteIntegration(propsWithProduct).then((results) => {
						results.should.match({
							method: 'delete',
							uri: `/v1/products/${product}/integrations/${props.integrationId}`,
							auth: props.auth,
						});
					});
				});
			});
		});
		describe('.listIntegrations', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.listIntegrations(props).then((results) => {
						results.should.match({
							method: 'get',
							uri: '/v1/integrations',
							auth: props.auth,
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.listIntegrations(propsWithProduct).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/products/${product}/integrations`,
							auth: props.auth,
						});
					});
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
				return api.setUserInfo({ auth: 'X', accountInfo: {first_name: 'John', last_name: 'Scully'} }).then((results) => {
					results.should.eql({
						method: 'put',
						uri: '/v1/user',
						auth: 'X',
						context: {},
						data: {
							account_info: {first_name: 'John', last_name: 'Scully'}
						}
					});

				});
			});
		});
		describe('.changeUsername', () => {
			it('generates request', () => {
				return api.changeUsername({ auth: 'X', currentPassword: 'blabla', username: 'john@skul.ly' }).then((results) => {
					results.should.eql({
						method: 'put',
						uri: '/v1/user',
						auth: 'X',
						context: {},
						data: {
							current_password: 'blabla',
							username: 'john@skul.ly'
						}
					});

				});
			});
		});
		describe('.changeUserPassword', () => {
			it('generates request', () => {
				return api.changeUserPassword({ auth: 'X', currentPassword: 'blabla', password: 'blabla2' }).then((results) => {
					results.should.eql({
						method: 'put',
						uri: '/v1/user',
						auth: 'X',
						context: {},
						data: {
							current_password: 'blabla',
							password: 'blabla2'
						}
					});

				});
			});
		});
		describe('.listSIMs', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.listSIMs(props).then((results) => {
						results.should.match({
							method: 'get',
							uri: '/v1/sims',
							auth: props.auth
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.listSIMs(propsWithProduct).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/products/${product}/sims`,
							auth: props.auth,
							query: {
								iccid: props.iccid,
								deviceId: props.deviceId,
								deviceName: props.deviceName,
								page: props.page,
								per_page: props.perPage
							}
						});
					});
				});
			});
		});
		describe('.activateSIM', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.activateSIM(props).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/sims/${props.iccid}`,
							auth: props.auth,
							data: {
								country: props.country,
								action: 'activate'
							}
						});
					});
				});
			});
			describe('product scope', () => {
				describe('single SIM', () => {
					it('generates request', () => {
						const propsSingleSIM = Object.assign({}, propsWithProduct);
						delete propsSingleSIM.iccids;
						return api.activateSIM(propsSingleSIM).then((results) => {
							results.should.match({
								method: 'post',
								uri: `/v1/products/${product}/sims`,
								auth: props.auth,
								data: {
									sims: [props.iccid],
									country: props.country,
								}
							});
						});
					});
				});
				describe('multiple SIMs', () => {
					it('generates request', () => {
						return api.activateSIM(propsWithProduct).then((results) => {
							results.should.match({
								method: 'post',
								uri: `/v1/products/${product}/sims`,
								auth: props.auth,
								data: {
									sims: props.iccids,
									country: props.country,
								}
							});
						});
					});
				});
			});
		});
		describe('.deactivateSIM', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.deactivateSIM(props).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/sims/${props.iccid}`,
							auth: props.auth,
							data: {
								action: 'deactivate'
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.deactivateSIM(propsWithProduct).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/sims/${props.iccid}`,
							auth: props.auth,
							data: {
								action: 'deactivate'
							}
						});
					});
				});
			});
		});
		describe('.reactivateSIM', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.reactivateSIM(props).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/sims/${props.iccid}`,
							auth: props.auth,
							data: {
								mb_limit: props.mbLimit,
								action: 'reactivate'
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.reactivateSIM(propsWithProduct).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/sims/${props.iccid}`,
							auth: props.auth,
							data: {
								mb_limit: props.mbLimit,
								action: 'reactivate'
							}
						});
					});
				});
			});
		});
		describe('.removeSIM', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.removeSIM(props).then((results) => {
						results.should.match({
							method: 'delete',
							uri: `/v1/sims/${props.iccid}`,
							auth: props.auth
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.removeSIM(propsWithProduct).then((results) => {
						results.should.match({
							method: 'delete',
							uri: `/v1/products/${product}/sims/${props.iccid}`,
							auth: props.auth
						});
					});
				});
			});
		});
		describe('.updateSIM', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.updateSIM(props).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/sims/${props.iccid}`,
							auth: props.auth,
							data: {
								mb_limit: props.mbLimit
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.updateSIM(propsWithProduct).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/sims/${props.iccid}`,
							auth: props.auth,
							data: {
								mb_limit: props.mbLimit
							}
						});
					});
				});
			});
		});
		describe('.getSIMDataUsage', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.getSIMDataUsage(props).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/sims/${props.iccid}/data_usage`,
							auth: props.auth
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.getSIMDataUsage(propsWithProduct).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/products/${product}/sims/${props.iccid}/data_usage`,
							auth: props.auth
						});
					});
				});
			});
		});
		describe('.getFleetDataUsage', () => {
			it('generates request', () => {
				return api.getFleetDataUsage(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}/sims/data_usage`,
						auth: props.auth
					});
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

		describe('.listOAuthClients', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.listOAuthClients(props).then((results) => {
						results.should.match({
							method: 'get',
							uri: '/v1/clients',
							auth: props.auth
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.listOAuthClients(propsWithProduct).then((results) => {
						results.should.match({
							method: 'get',
							uri: `/v1/products/${product}/clients`,
							auth: props.auth
						});
					});
				});
			});
		});

		describe('.createOAuthClient', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.createOAuthClient(props).then((results) => {
						results.should.match({
							method: 'post',
							uri: '/v1/clients',
							auth: props.auth,
							data: {
								name: props.name,
								type: props.type,
								redirect_uri: props.redirect_uri,
								scope: props.scope
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.createOAuthClient(propsWithProduct).then((results) => {
						results.should.match({
							method: 'post',
							uri: `/v1/products/${product}/clients`,
							auth: props.auth,
							data: {
								name: props.name,
								type: props.type,
								redirect_uri: props.redirect_uri,
								scope: props.scope
							}
						});
					});
				});
			});
		});

		describe('.updateOAuthClient', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.updateOAuthClient(props).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/clients/${props.clientId}`,
							auth: 'X',
							data: {
								name: props.name,
								scope: props.scope
							}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.updateOAuthClient(propsWithProduct).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/clients/${props.clientId}`,
							auth: 'X',
							data: {
								name: props.name,
								scope: props.scope
							}
						});
					});
				});
			});
		});

		describe('.deleteOAuthClient', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.deleteOAuthClient(props).then((results) => {
						results.should.match({
							method: 'delete',
							uri: `/v1/clients/${props.clientId}`,
							auth: 'X'
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.deleteOAuthClient(propsWithProduct).then((results) => {
						results.should.match({
							method: 'delete',
							uri: `/v1/products/${product}/clients/${props.clientId}`,
							auth: 'X'
						});
					});
				});
			});
		});

		describe('.listProducts', () => {
			it('generates request', () => {
				return api.listProducts(props).then((results) => {
					results.should.match({
						method: 'get',
						uri: '/v1/products',
						auth: props.auth
					});
				});
			});
		});

		describe('.getProduct', () => {
			it('generates request', () => {
				return api.getProduct(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}`,
						auth: props.auth
					});
				});
			});
		});

		describe('.listProductFirmware', () => {
			it('generates request', () => {
				return api.listProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}/firmware`,
						auth: props.auth
					});
				});
			});
		});

		describe('.uploadProductFirmware', () => {
			it('generates request', () => {
				return api.uploadProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						method: 'post',
						uri: `/v1/products/${product}/firmware`,
						auth: props.auth,
						files: {
							'firmware.bin': props.file,
						},
						form: {
							version: props.version,
							title: props.title,
							description: props.description
						}
					});
				});
			});
		});

		describe('.getProductFirmware', () => {
			it('generates request', () => {
				return api.getProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}/firmware/${props.version}`,
						auth: props.auth
					});
				});
			});
		});

		describe('.updateProductFirmware', () => {
			it('generates request', () => {
				return api.updateProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						method: 'put',
						uri: `/v1/products/${product}/firmware/${props.version}`,
						auth: props.auth,
						data: {
							title: props.title,
							description: props.description
						}
					});
				});
			});
		});

		describe('.releaseProductFirmware', () => {
			it('generates request', () => {
				return api.releaseProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						method: 'put',
						uri: `/v1/products/${product}/firmware/release`,
						auth: props.auth,
						data: {
							version: props.version,
						}
					});
				});
			});
		});

		describe('.listTeamMembers', () => {
			it('generates request', () => {
				return api.listTeamMembers(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}/team`,
						auth: props.auth
					});
				});
			});
		});

		describe('.inviteTeamMember', () => {
			it('generates request', () => {
				return api.inviteTeamMember(propsWithProduct).then((results) => {
					results.should.match({
						method: 'post',
						uri: `/v1/products/${product}/team`,
						auth: props.auth,
						data: {
							username: props.username
						}
					});
				});
			});
		});

		describe('.removeTeamMember', () => {
			it('generates request', () => {
				return api.removeTeamMember(propsWithProduct).then((results) => {
					results.should.match({
						method: 'delete',
						uri: `/v1/products/${product}/team/${props.username}`,
						auth: props.auth,
					});
				});
			});
		});

		describe('.lookupSerialNumber', () => {
			it('generates request', () => {
				return api.lookupSerialNumber(props).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/serial_numbers/${props.serialNumber}`,
						auth: props.auth
					});
				});
			});
		});
	});

	describe('backwards-compatibility function aliases', () => {
		it('maps removeAccessToken to deleteAccessToken', () => {
			api.removeAccessToken.should.equal(api.deleteAccessToken);
		});
	});

	describe('.deviceUri', () => {
		describe('user scope', () => {
			it('gets the user device uri', () => {
				const uri = api.deviceUri({ deviceId: 'abc' });
				uri.should.equal('/v1/devices/abc');
			});
		});
		describe('product scope', () => {
			it('gets the product device uri', () => {
				const uri = api.deviceUri({ deviceId: 'abc', product: 'xyz' });
				uri.should.equal('/v1/products/xyz/devices/abc');
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

	describe('context', () => {
		describe('_isValidContext', () => {
			it('does not have context items set after default construction', () => {
				const api = new Particle();
				api.should.have.property('context').eql({});
			});
			it('is valid for known types and non-empty object', () => {
				api._isValidContext('tool', {abc:'123'}).should.be.ok;
				api._isValidContext('project', {abc:'123'}).should.be.ok;
			});
			it('is not valid for unknown types and non-empty object', () => {
				api._isValidContext('tool1', {abc:'123'}).should.not.be.ok;
				api._isValidContext('project1', {abc:'123'}).should.not.be.ok;
			});
			it('is not valid for known types and falsey object', () => {
				api._isValidContext('tool', {}).should.not.be.ok;
				api._isValidContext('tool', 0).should.not.be.ok;
				api._isValidContext('tool', null).should.not.be.ok;
				api._isValidContext('tool').should.not.be.ok;
			});
			it('sets a valid context', () => {
				api.setContext('tool', {name:'spanner'});
				api.context.should.have.property('tool').property('name').equal('spanner');
			});
		});

		describe('_buildContext', () => {
			it('uses the api context when no context provided', () => {
				const tool = {name:'spanner'};
				api.setContext('tool', tool);
				api._buildContext().should.eql({tool});
			});
			it('overrides the api context completely for a given context item', () => {
				const tool = {name:'spanner', version:'1.2.3'};
				api.setContext('tool', tool);
				const newTool = {name:'pliers'};
				api._buildContext({tool:newTool}).should.eql({tool:newTool});
			});
		});

		describe('agent forwarders', () => {
			let context;
			let contextResult;
			let result;
			beforeEach(() => {
				context = { abc: 123 };
				contextResult = { def: 456 };
				result = 'result';
				api._buildContext = sinon.stub().returns(contextResult);
			});

			afterEach(() => {
				expect(api._buildContext).to.have.been.calledWith(context);
			});

			it('calls _buildContext from get', () => {
				api.agent.get = sinon.stub().returns(result);
				api.get('uri', 'auth', 'query', context).should.eql(result);
				expect(api.agent.get).to.have.been.calledWith('uri', 'auth', 'query', contextResult);
			});

			it('calls _buildContext from head', () => {
				api.agent.head = sinon.stub().returns(result);
				api.head('uri', 'auth', 'query', context).should.eql(result);
				expect(api.agent.head).to.have.been.calledWith('uri', 'auth', 'query', contextResult);
			});

			it('calls _buildContext from post', () => {
				api.agent.post = sinon.stub().returns(result);
				api.post('uri', 'data', 'auth', context).should.eql(result);
				expect(api.agent.post).to.have.been.calledWith('uri', 'data', 'auth', contextResult);
			});

			it('calls _buildContext from put', () => {
				api.agent.put = sinon.stub().returns(result);
				api.put('uri', 'data', 'auth', context).should.eql(result);
				expect(api.agent.put).to.have.been.calledWith('uri', 'data', 'auth', contextResult);
			});

			it('calls _buildContext from delete', () => {
				api.agent.delete = sinon.stub().returns(result);
				api.delete('uri', 'data', 'auth', context).should.eql(result);
				expect(api.agent.delete).to.have.been.calledWith('uri', 'data', 'auth', contextResult);
			});

			it('calls _buildContext from request', () => {
				api.agent.request = sinon.stub().returns(result);
				api.request({context}).should.eql(result);
				expect(api.agent.request).to.have.been.calledWith({context:contextResult});
			});
		});
	});

});
