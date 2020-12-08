import should from 'should'; // monkeypatch the world~!1
import Particle from '../src/Particle';
import Defaults from '../src/Defaults';
import Client from '../src/Client';
import EventStream from '../src/EventStream';
import FakeAgent from './FakeAgent';
import { sinon, expect } from './test-setup';

let api;

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
	device: 'my-device',
	key: 'c1a55e5',
	event: 'main',
	token: 'Y',
	signal: '1',
	auth: 'X',
	accountInfo : { first_name: 'John', last_name: 'Scully', business_account: true, company_name: 'Apple Inc.' },
	files: {
		'app.ino': new Buffer('void(){}\nsetup(){}\n')
	},
	binaryId: '123456',
	targetVersion: '0.4.7',
	headers: {
		test: 'header'
	},
	rejectUnauthorized: true,
	noDefaults: true,
	hook: {
		method: 'PUT',
		auth: {
			username: 'u',
			password: 'p'
		},
		headers: {
			one: '1',
			two: '2'
		},
		query: {
			q: 'p'
		},
		json: {
			j: 'd'
		},
		form: {
			f: 'd'
		},
		body: '{{data}}',
		responseTemplate: 'template',
		responseEvent: 'res-event',
		errorResponseEvent: 'res-err-event'
	},
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
		url: 'http://example.com'
	},
	otp: '123456',
	mfaToken: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	networkId: '65535',
	groups: ['foo', 'bar'],
	dateRange: '2020-05-15T18:29:45.000Z,2020-05-19T18:29:45.000Z',
	rectBl: '56.185412,-4.049868',
	rectTr: '56.571537,-5.385920'
};

const product = 'ze-product-v1';
const propsWithProduct = Object.assign({ product }, props);

class Common {
	static expectCredentials({ form }){
		form.username.should.equal(props.username);
		form.password.should.equal(props.password);
	}
	static expectDeviceUrlAndToken(results){
		results.uri.should.containEql(props.deviceId);
		results.auth.should.equal(props.auth);
	}
}

describe('ParticleAPI', () => {
	beforeEach(() => {
		api = new Particle();
	});

	// eslint-disable-next-line max-statements
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
				return api.trackingIdentity({ auth: 'X', full: true, context })
					.then((req) => {
						expect(req).to.have.property('uri', '/v1/user/identify');
						expect(req).to.have.property('method', 'get');
						expect(req).to.have.property('query', undefined);
						expect(req).to.have.property('context').that.is.eql(context);
						expect(req).to.have.property('auth', 'X');
					});
			});

			it('id only', () => {
				return api.trackingIdentity().then(req => {
					expect(req).to.have.property('uri').eql('/v1/user/identify');
					expect(req).to.have.property('method').eql('get');
					expect(req).to.have.property('context').eql({});
					expect(req).to.have.property('query').eql({ tracking: 1 });
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
						uri: '/v1/user/mfa-enable',
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						query: undefined,
						context: {}
					});
				});
			});
		});

		describe('.confirmMfa', () => {
			it('sends request to confirm mfa enrollment', () => {
				return api.confirmMfa(props).then((results) => {
					results.should.eql({
						uri: '/v1/user/mfa-enable',
						method: 'post',
						auth: props.auth,
						headers: props.headers,
						data: {
							otp: props.otp,
							mfa_token: props.mfaToken
						},
						context: {}
					});
				});
			});
			it('allows invalidating tokens', () => {
				return api.confirmMfa(Object.assign({ invalidateTokens: true }, props)).then((results) => {
					results.should.eql({
						uri: '/v1/user/mfa-enable',
						method: 'post',
						auth: props.auth,
						headers: props.headers,
						data: {
							otp: props.otp,
							mfa_token: props.mfaToken,
							invalidate_tokens: true
						},
						context: {}
					});
				});
			});
		});

		describe('.disableMfa', () => {
			it('sends request to disable mfa', () => {
				return api.disableMfa(props).then((results) => {
					results.should.eql({
						uri: '/v1/user/mfa-disable',
						method: 'put',
						auth: props.auth,
						headers: props.headers,
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
						uri: '/v1/users',
						method: 'post',
						auth: undefined,
						headers: props.headers,
						data: {
							username: props.username,
							password: props.password,
							account_info: props.accountInfo
						},
						context: {}
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

		describe('.deleteActiveAccessTokens', () => {
			it('sends request', () => {
				return api.deleteActiveAccessTokens(props).then((results) => {
					results.should.match({
						method: 'delete',
						uri: '/v1/access_tokens',
						auth: props.auth,
					});
				});
			});
		});

		describe('.listAccessTokens', () => {
			let options;

			beforeEach(() => {
				options = {
					username: props.username,
					password: props.password,
					otp: props.otp
				};
			});

			it('sends credentials', () => {
				delete options.otp;
				return api.listAccessTokens(options)
					.then(({ auth, query }) => {
						expect(auth).to.be.an('object');
						expect(auth).to.have.property('username', options.username);
						expect(auth).to.have.property('password', options.password);
						expect(query).to.equal(undefined);
					});
			});

			it('includes otp when provided', () => {
				return api.listAccessTokens(options)
					.then(({ auth, query }) => {
						expect(auth).to.be.an('object');
						expect(auth).to.have.property('username', options.username);
						expect(auth).to.have.property('password', options.password);
						expect(query).to.be.an('object');
						expect(query).to.have.property('otp', props.otp);
						expect(props.otp).to.be.a('string').with.lengthOf(6);
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
								groups: props.groups.join(','),
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
			it('sends request to add a single device by id', () => {
				const prodProps = Object.assign({}, propsWithProduct);
				delete prodProps.file;
				return api.addDeviceToProduct(prodProps).then((results) => {
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

			it('sends request to add multiple devices using a file', () => {
				return api.addDeviceToProduct(propsWithProduct).then((results) => {
					results.should.match({
						method: 'post',
						uri: `/v1/products/${product}/devices`,
						auth: props.auth,
						files: {
							file: props.file,
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
			describe('user scope', () => {
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

			describe('product scope', () => {
				it('generates request', () => {
					return api.flashDevice(propsWithProduct).then((results) => {
						results.should.match({
							method: 'put',
							uri: `/v1/products/${product}/devices/${props.deviceId}`,
							auth: props.auth
						});
					});
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

		describe('.downloadFirmwareBinary', () => {
			it('generates request', () => {
				sinon.stub(api, '_provideFileData').callsFake(x => Promise.resolve(x));
				const req = api.downloadFirmwareBinary(propsWithProduct);
				api._provideFileData.callCount.should.equal(1);
				return req.then((results) => {
					results.should.match({
						uri: `/v1/binaries/${props.binaryId}`,
						method: 'get',
						auth: props.auth,
						raw: true
					});
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
				sinon.stub(EventStream.prototype, 'connect').callsFake(function connect(){
					return Promise.resolve({ uri: this.uri });
				});
			});

			after(() => {
				sinon.restore();
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
				return api.getEventStream({ product: 'test-product' })
					.then(({ uri }) => {
						uri.should.endWith('v1/products/test-product/events');
					});
			});

			it('requests a product\'s named event without an org provided', () => {
				return api.getEventStream({ product: 'test-product', name: 'foo' })
					.then(({ uri }) => {
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
							uri: '/v1/webhooks',
							method: 'post',
							auth: props.auth,
							headers: props.headers,
							data: {
								event: props.event,
								url: props.url,
								deviceId: props.device,
								rejectUnauthorized: props.rejectUnauthorized,
								noDefaults: props.noDefaults,
								requestType: props.hook.method,
								auth: props.hook.auth,
								headers: props.hook.headers,
								query: props.hook.query,
								json: props.hook.json,
								form: props.hook.form,
								body: props.hook.body,
								responseTemplate: props.hook.responseTemplate,
								responseTopic: props.hook.responseEvent,
								errorResponseTopic: props.hook.errorResponseEvent,
							},
							context: {}
						});
					});
				});

				it('creates for user\'s devices', () => {
					const params = Object.assign({}, props);
					delete params.device;
					return api.createWebhook(params).then((results) => {
						results.should.match({
							uri: '/v1/webhooks',
							method: 'post',
							auth: props.auth,
							headers: props.headers,
							data: {
								event: props.event,
								url: props.url,
								deviceId: undefined,
								rejectUnauthorized: props.rejectUnauthorized,
								noDefaults: props.noDefaults,
								requestType: props.hook.method,
								auth: props.hook.auth,
								headers: props.hook.headers,
								query: props.hook.query,
								json: props.hook.json,
								form: props.hook.form,
								body: props.hook.body,
								responseTemplate: props.hook.responseTemplate,
								responseTopic: props.hook.responseEvent,
								errorResponseTopic: props.hook.errorResponseEvent,
							},
							context: {}
						});
					});
				});

				it('creates using defaults', () => {
					const params = Object.assign({}, props);
					delete params.device;
					delete params.rejectUnauthorized;
					delete params.noDefaults;
					delete params.hook;
					delete params.headers;
					delete params.context;
					return api.createWebhook(params).then((results) => {
						results.should.match({
							uri: '/v1/webhooks',
							method: 'post',
							auth: props.auth,
							headers: undefined,
							data: {
								event: props.event,
								url: props.url,
								deviceId: undefined,
								rejectUnauthorized: undefined,
								noDefaults: undefined,
								requestType: 'POST'
							},
							context: {}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.createWebhook(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/webhooks`,
							method: 'post',
							auth: props.auth,
							headers: props.headers,
							data: {
								event: props.event,
								url: props.url,
								deviceId: props.device,
								rejectUnauthorized: props.rejectUnauthorized,
								noDefaults: props.noDefaults,
								requestType: props.hook.method,
								auth: props.hook.auth,
								headers: props.hook.headers,
								query: props.hook.query,
								json: props.hook.json,
								form: props.hook.form,
								body: props.hook.body,
								responseTemplate: props.hook.responseTemplate,
								responseTopic: props.hook.responseEvent,
								errorResponseTopic: props.hook.errorResponseEvent,
							},
							context: {}
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
				return api.setUserInfo({ auth: 'X', accountInfo: { first_name: 'John', last_name: 'Scully' } })
					.then((results) => {
						results.should.eql({
							uri: '/v1/user',
							method: 'put',
							auth: 'X',
							headers: undefined,
							data: {
								account_info: { first_name: 'John', last_name: 'Scully' }
							},
							context: {}
						});
					});
			});
		});

		describe('.changeUsername', () => {
			it('generates request', () => {
				return api.changeUsername({ auth: 'X', currentPassword: 'blabla', username: 'john@skul.ly' })
					.then((results) => {
						results.should.eql({
							uri: '/v1/user',
							method: 'put',
							auth: 'X',
							headers: undefined,
							data: {
								current_password: 'blabla',
								username: 'john@skul.ly'
							},
							context: {}
						});
					});
			});
			it('allows invalidating tokens', () => {
				return api.changeUsername({ auth: 'X', currentPassword: 'blabla', username: 'john@skul.ly', invalidateTokens: true })
					.then((results) => {
						results.should.eql({
							uri: '/v1/user',
							method: 'put',
							auth: 'X',
							headers: undefined,
							data: {
								current_password: 'blabla',
								username: 'john@skul.ly',
								invalidate_tokens: true
							},
							context: {}
						});
					});
			});
		});

		describe('.changeUserPassword', () => {
			it('generates request', () => {
				return api.changeUserPassword({ auth: 'X', currentPassword: 'blabla', password: 'blabla2' })
					.then((results) => {
						results.should.eql({
							uri: '/v1/user',
							method: 'put',
							auth: 'X',
							headers: undefined,
							data: {
								current_password: 'blabla',
								password: 'blabla2'
							},
							context: {}
						});
					});
			});

			it('allows invalidating tokens', () => {
				return api.changeUserPassword({ auth: 'X', currentPassword: 'blabla', password: 'blabla2', invalidateTokens: true })
					.then((results) => {
						results.should.eql({
							method: 'put',
							uri: '/v1/user',
							auth: 'X',
							headers: undefined,
							data: {
								current_password: 'blabla',
								password: 'blabla2',
								invalidate_tokens: true
							},
							context: {}
						});
					});
			});
		});

		describe('.listSIMs', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.listSIMs(props).then((results) => {
						results.should.match({
							uri: '/v1/sims',
							method: 'get',
							auth: props.auth,
							headers: props.headers,
							query: undefined,
							context: {}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.listSIMs(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/sims`,
							method: 'get',
							auth: props.auth,
							headers: props.headers,
							query: {
								iccid: props.iccid,
								deviceId: props.deviceId,
								deviceName: props.deviceName,
								page: props.page,
								per_page: props.perPage
							},
							context: {}
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
							uri: `/v1/sims/${props.iccid}`,
							method: 'put',
							auth: props.auth,
							headers: props.headers,
							data: {
								country: props.country,
								action: 'activate'
							},
							context: {}
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
								uri: `/v1/products/${product}/sims`,
								method: 'post',
								auth: props.auth,
								headers: props.headers,
								data: {
									sims: [props.iccid],
									country: props.country,
								},
								context: {}
							});
						});
					});
				});

				describe('multiple SIMs', () => {
					it('generates request', () => {
						return api.activateSIM(propsWithProduct).then((results) => {
							results.should.match({
								uri: `/v1/products/${product}/sims`,
								method: 'post',
								auth: props.auth,
								headers: props.headers,
								data: {
									sims: props.iccids,
									country: props.country,
								},
								context: {}
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
							uri: `/v1/sims/${props.iccid}`,
							method: 'put',
							auth: props.auth,
							headers: props.headers,
							data: {
								action: 'deactivate'
							},
							context: {}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.deactivateSIM(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/sims/${props.iccid}`,
							method: 'put',
							auth: props.auth,
							headers: props.headers,
							data: {
								action: 'deactivate'
							},
							context: {}
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
							uri: `/v1/sims/${props.iccid}`,
							method: 'put',
							auth: props.auth,
							headers: props.headers,
							data: {
								mb_limit: props.mbLimit,
								action: 'reactivate'
							},
							context: {}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.reactivateSIM(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/sims/${props.iccid}`,
							method: 'put',
							auth: props.auth,
							headers: props.headers,
							data: {
								mb_limit: props.mbLimit,
								action: 'reactivate'
							},
							context: {}
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
							uri: `/v1/sims/${props.iccid}`,
							method: 'delete',
							auth: props.auth,
							headers: props.headers,
							data: undefined,
							context: {}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.removeSIM(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/sims/${props.iccid}`,
							method: 'delete',
							auth: props.auth,
							headers: props.headers,
							data: undefined,
							context: {}
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
							uri: `/v1/sims/${props.iccid}`,
							method: 'put',
							auth: props.auth,
							headers: props.headers,
							data: {
								mb_limit: props.mbLimit
							},
							context: {}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.updateSIM(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/sims/${props.iccid}`,
							method: 'put',
							auth: props.auth,
							headers: props.headers,
							data: {
								mb_limit: props.mbLimit
							},
							context: {}
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
							uri: `/v1/sims/${props.iccid}/data_usage`,
							method: 'get',
							auth: props.auth,
							headers: props.headers,
							query: undefined,
							context: {}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.getSIMDataUsage(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/sims/${props.iccid}/data_usage`,
							method: 'get',
							auth: props.auth,
							headers: props.headers,
							query: undefined,
							context: {}
						});
					});
				});
			});
		});

		describe('.getFleetDataUsage', () => {
			it('generates request', () => {
				return api.getFleetDataUsage(propsWithProduct).then((results) => {
					results.should.match({
						uri: `/v1/products/${product}/sims/data_usage`,
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						query: undefined,
						context: {}
					});
				});
			});
		});

		describe('.checkSIM', () => {
			it('generates request', () => {
				return api.checkSIM({ auth: 'X', iccid: '1234567890123456789' }).then((results) => {
					results.should.match({
						uri: '/v1/sims/1234567890123456789',
						method: 'head',
						auth: 'X',
						headers: undefined,
						query: undefined,
						context: {}
					});
				});
			});
		});

		describe('.listLibraries', () => {
			it('generates request', () => {
				return api.listLibraries(props).then((results) => {
					results.should.match({
						uri: '/v1/libraries',
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						context: {}
					});
				});
			});

			it('forwards query parameters', () => {
				return api.listLibraries({
					auth: 'X',
					page: 3,
					filter: 'abc',
					sort: 'name',
					architectures: ['spark-core', 'particle-photon'],
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
				return api.getLibrary({ name: 'mylib', auth: 'X', version: '1.2.0' }).then((results) => {
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
				return api.getLibraryVersions({ name: 'mylib', auth: 'X', page: 3 }).then((results) => {
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
				return api.contributeLibrary({ archive: archive, auth: 'X' }).then((results) => {
					results.should.match({
						uri: '/v1/libraries',
						method: 'post',
						auth: 'X'
					});
				});
			});
		});

		describe('.publishLibrary', () => {
			it('generates request', () => {
				const name = 'noname';
				return api.publishLibrary({ name, auth: 'X' }).then((results) => {
					results.should.match({
						uri: '/v1/libraries/noname',
						method: 'patch',
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
				return api.deleteLibrary({ name: 'mylib', auth: 'X', force: 'xyz' }).then((results) => {
					results.should.match({
						uri: '/v1/libraries/mylib',
						method: 'delete',
						auth: 'X',
						headers:undefined,
						data: {
							force: 'xyz'
						},
						context: {}
					});
				});
			});
		});

		describe('.downloadFile', () => {
			it('generates request', () => {
				sinon.stub(api, '_provideFileData').callsFake(x => Promise.resolve(x));
				const uri = 'http://example.com/path/to/file.png';
				const req = api.downloadFile({ uri });
				api._provideFileData.callCount.should.equal(1);
				return req.then((results) => {
					results.should.match({ uri, method: 'get', raw: true });
				});
			});
		});

		describe('.listOAuthClients', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.listOAuthClients(props).then((results) => {
						results.should.match({
							uri: '/v1/clients',
							method: 'get',
							auth: props.auth,
							headers: props.headers,
							query: undefined,
							context: {}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.listOAuthClients(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/clients`,
							method: 'get',
							auth: props.auth,
							headers: props.headers,
							query: undefined,
							context: {}
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
							uri: '/v1/clients',
							method: 'post',
							auth: props.auth,
							headers: props.headers,
							data: {
								name: props.name,
								type: props.type,
								redirect_uri: props.redirect_uri,
								scope: props.scope
							},
							context: {}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.createOAuthClient(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/clients`,
							method: 'post',
							auth: props.auth,
							headers: props.headers,
							data: {
								name: props.name,
								type: props.type,
								redirect_uri: props.redirect_uri,
								scope: props.scope
							},
							context: {}
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
							uri: `/v1/clients/${props.clientId}`,
							method: 'put',
							auth: props.auth,
							headers: props.headers,
							data: {
								name: props.name,
								scope: props.scope
							},
							context: {}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.updateOAuthClient(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/clients/${props.clientId}`,
							method: 'put',
							auth: props.auth,
							headers: props.headers,
							data: {
								name: props.name,
								scope: props.scope
							},
							context: {}
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
							uri: `/v1/clients/${props.clientId}`,
							method: 'delete',
							auth: props.auth,
							headers: props.headers,
							data: undefined,
							context: {}
						});
					});
				});
			});
			describe('product scope', () => {
				it('generates request', () => {
					return api.deleteOAuthClient(propsWithProduct).then((results) => {
						results.should.match({
							uri: `/v1/products/${product}/clients/${props.clientId}`,
							method: 'delete',
							auth: props.auth,
							headers: props.headers,
							data: undefined,
							context: {}
						});
					});
				});
			});
		});

		describe('.listProducts', () => {
			it('generates request', () => {
				return api.listProducts(props).then((results) => {
					results.should.match({
						uri: '/v1/products',
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						query: undefined,
						context: {}
					});
				});
			});
		});

		describe('.getProduct', () => {
			it('generates request', () => {
				return api.getProduct(propsWithProduct).then((results) => {
					results.should.match({
						uri: `/v1/products/${product}`,
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						query: undefined,
						context: {}
					});
				});
			});
		});

		describe('.listProductFirmware', () => {
			it('generates request', () => {
				return api.listProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						uri: `/v1/products/${product}/firmware`,
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						query: undefined,
						context: {}
					});
				});
			});
		});

		describe('.uploadProductFirmware', () => {
			it('generates request', () => {
				return api.uploadProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						uri: `/v1/products/${product}/firmware`,
						method: 'post',
						auth: props.auth,
						headers: props.headers,
						files: {
							'firmware.bin': props.file,
						},
						form: {
							version: props.version,
							title: props.title,
							description: props.description
						},
						context: {}
					});
				});
			});
		});

		describe('.downloadProductFirmware', () => {
			it('generates request', () => {
				sinon.stub(api, '_provideFileData').callsFake(x => Promise.resolve(x));
				const req = api.downloadProductFirmware(propsWithProduct);
				api._provideFileData.callCount.should.equal(1);
				return req.then((results) => {
					results.should.match({
						uri: `/v1/products/${product}/firmware/${props.version}/binary`,
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						context: {},
						raw: true
					});
				});
			});
		});

		describe('.getProductFirmware', () => {
			it('generates request', () => {
				return api.getProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						uri: `/v1/products/${product}/firmware/${props.version}`,
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						query: undefined,
						context: {}
					});
				});
			});
		});

		describe('.updateProductFirmware', () => {
			it('generates request', () => {
				return api.updateProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						uri: `/v1/products/${product}/firmware/${props.version}`,
						method: 'put',
						auth: props.auth,
						headers: props.headers,
						data: {
							title: props.title,
							description: props.description
						},
						context: {}
					});
				});
			});
		});

		describe('.releaseProductFirmware', () => {
			it('generates request', () => {
				return api.releaseProductFirmware(propsWithProduct).then((results) => {
					results.should.match({
						uri: `/v1/products/${product}/firmware/release`,
						method: 'put',
						auth: props.auth,
						headers: props.headers,
						data: {
							version: props.version,
						},
						context: {}
					});
				});
			});
		});

		describe('.listTeamMembers', () => {
			it('generates request', () => {
				return api.listTeamMembers(propsWithProduct).then((results) => {
					results.should.match({
						uri: `/v1/products/${product}/team`,
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						query: undefined,
						context: {}
					});
				});
			});
		});

		describe('.inviteTeamMember', () => {
			it('generates request', () => {
				return api.inviteTeamMember(propsWithProduct).then((results) => {
					results.should.match({
						uri: `/v1/products/${product}/team`,
						method: 'post',
						auth: props.auth,
						headers: props.headers,
						data: {
							username: props.username
						},
						context: {}
					});
				});
			});
		});

		describe('.removeTeamMember', () => {
			it('generates request', () => {
				return api.removeTeamMember(propsWithProduct).then((results) => {
					results.should.match({
						uri: `/v1/products/${product}/team/${props.username}`,
						method: 'delete',
						auth: props.auth,
						headers: props.headers,
						data: undefined,
						context: {}
					});
				});
			});
		});

		describe('.lookupSerialNumber', () => {
			it('generates request', () => {
				return api.lookupSerialNumber(props).then((results) => {
					results.should.match({
						uri: `/v1/serial_numbers/${props.serialNumber}`,
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						query: undefined,
						context: {}
					});
				});
			});
		});

		describe('.createMeshNetwork', () => {
			it('generates request', () => {
				return api.createMeshNetwork(props).then((results) => {
					results.should.match({
						uri: '/v1/networks',
						method: 'post',
						auth: props.auth,
						headers: props.headers,
						data: {
							name: props.name,
							device_id: props.deviceId,
							iccid: props.iccid
						},
						context: {}
					});
				});
			});
		});

		describe('.removeMeshNetwork', () => {
			it('generates request', () => {
				return api.removeMeshNetwork(props).then((results) => {
					results.should.match({
						uri: `/v1/networks/${props.networkId}`,
						method: 'delete',
						auth: props.auth,
						headers: props.headers,
						data: undefined,
						context: {}
					});
				});
			});
		});

		describe('.listMeshNetworks', () => {
			it('generates request', () => {
				return api.listMeshNetworks(props).then((results) => {
					results.should.match({
						method: 'get',
						uri: '/v1/networks',
						auth: props.auth,
						headers: props.headers,
						query: {
							page: props.page,
							per_page: props.perPage
						},
						context: {}
					});
				});
			});
		});

		describe('.getMeshNetwork', () => {
			it('generates request', () => {
				return api.getMeshNetwork(props).then((results) => {
					results.should.match({
						uri: `/v1/networks/${props.networkId}`,
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						query: undefined,
						context: {}
					});
				});
			});
		});

		describe('.updateMeshNetwork', () => {
			it('generates request', () => {
				const p = Object.assign(props, { action: 'test' });
				return api.updateMeshNetwork(p).then((results) => {
					results.should.match({
						uri: `/v1/networks/${p.networkId}`,
						method: 'put',
						auth: p.auth,
						headers: p.headers,
						data: {
							action: p.action,
							device_id: p.deviceId
						},
						context: {}
					});
				});
			});
		});

		describe('.addMeshNetworkDevice', () => {
			it('generates request', () => {
				return api.addMeshNetworkDevice(props).then((results) => {
					results.should.match({
						method: 'put',
						uri: `/v1/networks/${props.networkId}`,
						auth: props.auth,
						data: {
							action: 'add-device',
							device_id: props.deviceId
						}
					});
				});
			});
		});

		describe('.removeMeshNetworkDevice', () => {
			it('generates request', () => {
				return api.removeMeshNetworkDevice(props).then((results) => {
					results.should.match({
						method: 'put',
						uri: `/v1/networks/${props.networkId}`,
						auth: props.auth,
						data: {
							action: 'remove-device',
							device_id: props.deviceId
						}
					});
				});
			});
			it('does not require the network ID argument', () => {
				const p = Object.assign({}, props);
				delete p.networkId;
				return api.removeMeshNetworkDevice(p).then((results) => {
					results.should.match({
						method: 'delete',
						uri: `/v1/devices/${props.deviceId}/network`,
						auth: props.auth
					});
				});
			});
		});

		describe('.listMeshNetworkDevices', () => {
			it('generates request', () => {
				const p = Object.assign({ role: 'node' }, props);
				return api.listMeshNetworkDevices(p).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/networks/${props.networkId}/devices`,
						auth: p.auth,
						query: {
							role: p.role,
							page: p.page,
							per_page: p.perPage
						}
					});
				});
			});
		});

		describe('.getProductConfiguration', () => {
			it('generates request', () => {
				return api.getProductConfiguration(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}/config`,
						auth: props.auth
					});
				});
			});
		});

		describe('.getProductConfigurationSchema', () => {
			it('generates request', () => {
				return api.getProductConfigurationSchema(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}/config`,
						auth: props.auth,
						headers: { 'accept': 'application/schema+json' }
					});
				});
			});
		});

		describe('.getProductDeviceConfiguration', () => {
			it('generates request', () => {
				return api.getProductDeviceConfiguration(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}/config/${props.deviceId}`,
						auth: props.auth
					});
				});
			});
		});

		describe('.getProductDeviceConfigurationSchema', () => {
			it('generates request', () => {
				return api.getProductDeviceConfigurationSchema(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}/config/${props.deviceId}`,
						auth: props.auth,
						headers: { 'accept': 'application/schema+json' }
					});
				});
			});
		});

		describe('.setProductConfiguration', () => {
			it('generates request', () => {
				const p = Object.assign({ config: {
					foo: 'bar'
				} }, propsWithProduct);
				return api.setProductConfiguration(p).then((results) => {
					results.should.match({
						method: 'put',
						uri: `/v1/products/${product}/config`,
						auth: props.auth,
						data: {
							foo: 'bar'
						}
					});
				});
			});
		});

		describe('.setProductDeviceConfiguration', () => {
			it('generates request', () => {
				const p = Object.assign({ config: {
					foo: 'bar'
				} }, propsWithProduct);
				return api.setProductDeviceConfiguration(p).then((results) => {
					results.should.match({
						method: 'put',
						uri: `/v1/products/${product}/config/${props.deviceId}`,
						auth: props.auth,
						data: {
							foo: 'bar'
						}
					});
				});
			});
		});

		describe('.getProductLocations', () => {
			it('generates request', () => {
				return api.getProductLocations(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}/locations`,
						auth: props.auth,
						query: {
							date_range: props.dateRange,
							rect_bl: props.rectBl,
							rect_tr: props.rectTr,
							device_id: props.deviceId,
							device_name: props.deviceName,
							groups: props.groups,
							page: props.page,
							per_page: props.perPage
						}
					});
				});
			});
		});

		describe('.getProductDeviceLocations', () => {
			it('generates request', () => {
				return api.getProductDeviceLocations(propsWithProduct).then((results) => {
					results.should.match({
						method: 'get',
						uri: `/v1/products/${product}/locations/${props.deviceId}`,
						auth: props.auth,
						query: {
							date_range: props.dateRange,
							rect_bl: props.rectBl,
							rect_tr: props.rectTr
						}
					});
				});
			});
		});

		describe('.deleteUser', () => {
			it('sends request to delete the current user', () => {
				return api.deleteUser(props).then(result => {
					result.should.match({
						context: {},
						data: { password: props.password },
						method: 'delete',
						uri: '/v1/user',
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
				api._isValidContext('tool', { abc:'123' }).should.be.ok;
				api._isValidContext('project', { abc:'123' }).should.be.ok;
			});

			it('is not valid for unknown types and non-empty object', () => {
				api._isValidContext('tool1', { abc:'123' }).should.not.be.ok;
				api._isValidContext('project1', { abc:'123' }).should.not.be.ok;
			});

			it('is not valid for known types and falsey object', () => {
				api._isValidContext('tool', {}).should.not.be.ok;
				api._isValidContext('tool', 0).should.not.be.ok;
				api._isValidContext('tool', null).should.not.be.ok;
				api._isValidContext('tool').should.not.be.ok;
			});

			it('sets a valid context', () => {
				api.setContext('tool', { name:'spanner' });
				api.context.should.have.property('tool').property('name').equal('spanner');
			});
		});

		describe('_buildContext', () => {
			it('uses the api context when no context provided', () => {
				const tool = { name:'spanner' };
				api.setContext('tool', tool);
				api._buildContext().should.eql({ tool });
			});

			it('overrides the api context completely for a given context item', () => {
				const tool = { name:'spanner', version:'1.2.3' };
				api.setContext('tool', tool);
				const newTool = { name:'pliers' };
				api._buildContext({ tool:newTool }).should.eql({ tool:newTool });
			});
		});

		describe('agent forwarders', () => {
			let uri, auth, headers, query, data, context, contextResult, result;

			beforeEach(() => {
				uri = 'http://example.com/v1';
				auth = 'fake-token';
				headers = { 'X-FOO': 'foo', 'X-BAR': 'bar' };
				query = 'foo=1&bar=2';
				data = { foo: true, bar: false };
				context = { abc: 123 };
				contextResult = { def: 456 };
				result = 'fake-result';
				api._buildContext = sinon.stub().returns(contextResult);
			});

			afterEach(() => {
				expect(api._buildContext).to.have.been.calledWith(context);
			});

			it('calls _buildContext from get', () => {
				api.agent.get = sinon.stub().returns(result);
				const options = { uri, auth, headers, query, context };
				const res = api.get(options);
				expect(res).to.equal(result);
				expect(api.agent.get).to.have.been.calledWith({
					uri,
					auth,
					headers,
					query,
					context: contextResult
				});
			});

			it('calls _buildContext from head', () => {
				api.agent.head = sinon.stub().returns(result);
				const options = { uri, auth, headers, query, context };
				const res = api.head(options);
				expect(res).to.equal(result);
				expect(api.agent.head).to.have.been.calledWith({
					uri,
					auth,
					headers,
					query,
					context: contextResult
				});
			});

			it('calls _buildContext from post', () => {
				api.agent.post = sinon.stub().returns(result);
				const options = { uri, auth, headers, data, context };
				const res = api.post(options);
				expect(res).to.equal(result);
				expect(api.agent.post).to.have.been.calledWith({
					uri,
					auth,
					headers,
					data,
					context: contextResult
				});
			});

			it('calls _buildContext from put', () => {
				api.agent.put = sinon.stub().returns(result);
				const options = { uri, auth, headers, data, context };
				const res = api.put(options);
				expect(res).to.equal(result);
				expect(api.agent.put).to.have.been.calledWith({
					uri,
					auth,
					headers,
					data,
					context: contextResult
				});
			});

			it('calls _buildContext from delete', () => {
				api.agent.delete = sinon.stub().returns(result);
				const options = { uri, auth, headers, data, context };
				const res = api.delete(options);
				expect(res).to.equal(result);
				expect(api.agent.delete).to.have.been.calledWith({
					uri,
					auth,
					headers,
					data,
					context: contextResult
				});
			});

			it('calls _buildContext from request', () => {
				api.agent.request = sinon.stub().returns(result);
				api.request({ context }).should.eql(result);
				expect(api.agent.request).to.have.been.calledWith({ context:contextResult });
			});
		});
	});
});
