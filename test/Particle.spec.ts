import { sinon, expect } from './test-setup';
import Particle from '../src/Particle';
import Defaults from '../src/Defaults';
import Client from '../src/Client';
import EventStream from '../src/EventStream';
import FakeAgent from './FakeAgent';
import type { ToolContext, ProjectContext, EnvVarOp } from '../src/types';

interface ParticleInternal {
	_isValidContext(name: string, context: ToolContext | ProjectContext | undefined): boolean;
	_buildContext(context: { tool?: ToolContext; project?: ProjectContext } | undefined): { tool?: ToolContext; project?: ProjectContext };
	_getActiveAuthToken(auth?: string): string | undefined;
	_defaultAuth: string | undefined;
}

let api: Particle;

type R = Record<string, string | number | boolean | object | Buffer | string[] | null | undefined>;
function a<T>(v: object | string | number | null | undefined): T {
	return v as object as T;
}

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
		'app.ino': Buffer.from('void(){}\nsetup(){}\n')
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
	scope: 'Owner',
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
	version: '42',
	title: 'prod',
	description: 'ready for production',
	file: Buffer.from('ELF...'),
	country: 'RO',
	mbLimit: 5,
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
	rectTr: '56.571537,-5.385920',
	logicFunctionId: 'ea838324-a4a7-4fa6-b278-95bdaed7114b',
	logicRunId: 'd0580956-71dc-4f11-89e2-987dcf82a86f',
	logicFunction: {
		enabled: true,
		name: 'function-1',
		description: 'hello world',
		source: {
			type: 'JavaScript',
			code: 'console.log("hello from function-1");'
		},
		logic_triggers: [
			{
				type: 'Event',
				enabled: true,
				product_id: 9001,
				event_name: 'main',
			},
			{
				type: 'Scheduled',
				enabled: true,
				cron: '0 0 1 * *',
				start_at: '2021-05-15T18:29:45.000Z',
				end_at: '2021-05-19T18:29:45.000Z',
			}
		]
	},
	logic: {
		source: {
			type: 'JavaScript',
			code: 'export default function main() { console.log("hi"); }'
		},
		event: {
			event_name: 'main',
			device_id: '1234',
			event_data: JSON.stringify({ data: true }),
			product_id: 9001,
			user_id: '5678'
		}
	},
	ledgerName: 'myledger',
	ledger: {
		scope: 'Owner',
		name: 'myledger',
		description: 'my ledger',
		direction: 'CloudOnly'
	},
	scopeValue: 'abc1234',
	instance: {
		property: 'yes'
	},
	setMode: 'Replace',
	envVarKey: 'MY_VAR',
	envVarValue: 'hello',
	envVarOps: [
		{ op: 'Set', key: 'MY_VAR', value: 'hello' },
		{ op: 'Unset', key: 'OLD_VAR' }
	],
	envVarWhen: 'Immediate',
	utm: undefined as undefined | Record<string, string>
};

const product = 'ze-product-v1';
const propsWithProduct = Object.assign({ product }, props);

const org = 'test-org';
const propsWithOrg = Object.assign({ org }, props);

class Common {
	static expectCredentials(results: R) {
		const form = results.form as Record<string, string>;
		expect(form.username).to.equal(props.username);
		expect(form.password).to.equal(props.password);
	}
	static expectDeviceUrlAndToken(results: R) {
		expect(results.uri as string).to.include(props.deviceId);
		expect(results.auth).to.equal(props.auth);
	}
}

describe('ParticleAPI', () => {
	beforeEach(() => {
		api = new Particle();
	});


	describe('operations', () => {
		beforeEach(() => {
			api.agent = new FakeAgent() as object as typeof api.agent;
		});

		describe('constructor', () => {
			it('sets maps defaults to instance properties', () => {
				Object.keys(Defaults).forEach((setting) => {
					expect((api as object as Record<string, object>)[setting]).to.eql((Defaults as object as Record<string, object>)[setting]);
				});
			});

			describe('without defaultAuth', () => {
				it('does NOT call .setDefaultAuth(defaultAuth) unless provided value is truthy', () => {
					sinon.stub(api, 'setDefaultAuth');
					expect(api.setDefaultAuth).to.have.property('callCount', 0);
				});
			});

			describe('with defaultAuth', () => {
				it('calls .setDefaultAuth(defaultAuth) when provided defaultAuth value is truthy', () => {
					const fakeAuthToken = 'foo';
					sinon.stub(Particle.prototype, 'setDefaultAuth');
					api = new Particle({ auth: fakeAuthToken });
					expect(api.setDefaultAuth).to.have.property('callCount', 1);
					expect((api.setDefaultAuth as sinon.SinonStub).firstCall.args).to.have.lengthOf(1);
					expect((api.setDefaultAuth as sinon.SinonStub).firstCall.args[0]).to.eql(fakeAuthToken);
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
				return api.login(props).then((r) => Common.expectCredentials(r as object as R));
			});
		});

		describe('.loginAsClientOwner', () => {
			it('sends client ID and secret', () => {
				const clientApi = new Particle({
					clientId: 'foo',
					clientSecret: 'bar'
				});
				clientApi.agent = new FakeAgent() as object as typeof clientApi.agent;
				return clientApi.loginAsClientOwner({}).then((_req) => {
					const req = _req as object as R;
					expect(req.form).to.have.property('client_id').eql('foo');
					expect(req.form).to.have.property('client_secret').eql('bar');
					expect(req.form).to.have.property('grant_type').eql('client_credentials');
				});
			});
		});

		describe('.sendOtp', () => {
			it('sends request to oauth token endpoint to verify the user login', () => {
				return api.sendOtp(props).then((_results) => {
					const results = _results as object as R;
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
					expect(results).to.deep.equal({
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
					expect(results).to.deep.equal({
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
					expect(results).to.deep.equal({
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
					expect(results).to.deep.equal({
						uri: '/v1/user/mfa-disable',
						method: 'put',
						auth: props.auth,
						headers: props.headers,
						query: undefined,
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
				const clientApi = new Particle({
					clientId: 'foo',
					clientSecret: 'bar'
				});
				clientApi.agent = new FakeAgent() as object as typeof clientApi.agent;
				return clientApi.loginAsClientOwner({}).then((_req) => {
					const req = _req as object as R;
					expect(req.form).to.have.property('client_id').eql('foo');
					expect(req.form).to.have.property('client_secret').eql('bar');
					expect(req.form).to.have.property('grant_type').eql('client_credentials');
				});
			});
		});

		describe('.createUser', () => {
			it('sends credentials', () => {
				return api.createUser(props).then((results) => {
					expect(results).to.deep.equal({
						uri: '/v1/users',
						method: 'post',
						auth: undefined,
						headers: props.headers,
						data: {
							username: props.username,
							password: props.password,
							account_info: props.accountInfo,
							utm: undefined
						},
						context: {}
					});
				});
			});
			it('allows sending utm parameters', () => {
				props.utm = { utm_source: 'web' };
				return api.createUser(props).then((results) => {
					expect(results).to.deep.equal({
						uri: '/v1/users',
						method: 'post',
						auth: undefined,
						headers: props.headers,
						data: {
							username: props.username,
							password: props.password,
							account_info: props.accountInfo,
							utm: {
								utm_source: 'web'
							}
						},
						context: {}
					});
				});
			});
		});

		describe('.resetPassword', () => {
			it('sends request', () => {
				return api.resetPassword(props).then((_results) => {
					const { data } = _results as object as R;
					expect((data as R).username).to.equal(props.username);
				});
			});
		});

		describe('.deleteAccessToken', () => {
			it('sends request', () => {
				return api.deleteAccessToken(props).then((results) => {
					expect(results).to.containSubset({
						method: 'delete',
						uri: `/v1/access_tokens/${props.token}`,
					});
				});
			});
		});

		describe('.deleteCurrentAccessToken', () => {
			it('sends request', () => {
				return api.deleteCurrentAccessToken(props).then((results) => {
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
						method: 'delete',
						uri: '/v1/access_tokens',
						auth: props.auth,
					});
				});
			});
		});

		describe('.listDevices', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.listDevices(props).then((results) => {
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
							method: 'get',
							uri: `/v1/products/${product}/devices`,
							auth: props.auth,
							query: {
								deviceName: props.deviceName,
								page: props.page,
								per_page: props.perPage,
								groups: (props.groups as string[]).join(','),
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
				return api.claimDevice(props).then((_results) => {
					const results = _results as object as R;
					expect(results.data).to.be.instanceOf(Object);
					expect((results.data as R).id).to.equal(props.deviceId);
					expect(results.auth).to.equal(props.auth);
				});
			});
		});

		describe('.addDeviceToProduct', () => {
			it('sends request to add a single device by id', () => {
				const prodProps: R = Object.assign({}, propsWithProduct);
				delete prodProps.file;
				return api.addDeviceToProduct(a<Parameters<typeof api.addDeviceToProduct>[0]>(prodProps)).then((results) => {
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					return api.updateDevice(a<Parameters<typeof api.updateDevice>[0]>(props)).then((results) => {
						expect(results).to.containSubset({
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
					return api.updateDevice(a<Parameters<typeof api.updateDevice>[0]>(propsWithProduct)).then((results) => {
						expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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

		describe('.getVariable', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.getVariable(props).then((results) => {
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
				return api.signalDevice(a<Parameters<typeof api.signalDevice>[0]>(props)).then((r) => Common.expectDeviceUrlAndToken(r as object as R));
			});

			it('sends proper data', () => {
				return api.signalDevice(a<Parameters<typeof api.signalDevice>[0]>(props)).then((_results) => {
					const { data } = _results as object as R;
					expect(data).to.be.instanceOf(Object);
					expect((data as R).signal).to.equal(props.signal);
				});
			});
		});

		describe('.flashDevice', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.flashDevice(props).then((r) => Common.expectDeviceUrlAndToken(r as object as R));
				});

				it('sends proper data', () => {
					return api.flashDevice(props).then((_results) => {
						const { files, form } = _results as object as R;
						expect(form).to.be.instanceOf(Object);
						expect(files).to.be.instanceOf(Object);
						expect(files).to.have.property('app.ino').and.be.ok;
						expect((form as R).build_target_version).to.equal(props.targetVersion);
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.flashDevice(propsWithProduct).then((results) => {
						expect(results).to.containSubset({
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
				return api.compileCode(props).then((_results) => {
					const results = _results as object as R;
					expect(results.auth).to.equal(props.auth);
				});
			});

			it('sends proper data', () => {
				return api.compileCode(props).then((_results) => {
					const { files, form } = _results as object as R;
					expect(form).to.be.instanceOf(Object);
					expect(files).to.be.instanceOf(Object);
					expect(files).to.have.property('app.ino').and.be.ok;
					expect((form as R).build_target_version).to.equal(props.targetVersion);
				});
			});
		});

		describe('.downloadFirmwareBinary', () => {
			it('generates request', () => {
				sinon.stub(api, 'request').callsFake(x => Promise.resolve(x) as object as Promise<import('../src/types').RequestResponse>);
				const req = api.downloadFirmwareBinary(propsWithProduct);
				expect((api.request as sinon.SinonStub).callCount).to.equal(1);
				return req.then((results) => {
					expect(results).to.containSubset({
						uri: `/v1/binaries/${props.binaryId}`,
						method: 'get',
						auth: props.auth,
						isBuffer: true
					});
				});
			});
		});

		describe('.sendPublicKey', () => {
			it('generates request', () => {
				return api.sendPublicKey(props).then((r) => Common.expectDeviceUrlAndToken(r as object as R));
			});

			it('sends proper data', () => {
				return api.sendPublicKey(props).then((_results) => {
					const data = (_results as object as R).data as R;
					expect(data).to.be.instanceOf(Object);
					expect(data.deviceID).to.equal(props.deviceId);
					expect(data.publicKey).to.equal(props.key);
					expect(data.filename).to.equal('particle-api');
					expect(data.order).to.include('manual');
					expect(data.algorithm).to.equal('rsa');
				});
			});

			it('works with buffer', () => {
				return api.sendPublicKey({
					deviceId: '1337',
					key: Buffer.from(props.key as string),
				}).then((_results) => {
					const data = (_results as object as R).data as R;
					expect(data.publicKey).to.equal(props.key);
				});
			});
		});

		describe('.callFunction', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.callFunction(props).then((results) => {
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
				sinon.stub(EventStream.prototype, 'connect').callsFake(function connect(this: EventStream){
					return Promise.resolve({ uri: this.uri }) as object as Promise<EventStream>;
				});
			});

			after(() => {
				sinon.restore();
			});

			it('requests public events', () => {
				return api.getEventStream({ }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith('events'));
				});
			});

			it('requests all user events', () => {
				return api.getEventStream({ deviceId: 'mine' }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith('devices/events'));
				});
			});

			it('requests all named events', () => {
				return api.getEventStream({ name: 'test' }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith('v1/events/test'));
				});
			});

			it('requests all device events', () => {
				return api.getEventStream({ deviceId: '1337' }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith('1337/events'));
				});
			});

			it('requests user\'s named events', () => {
				return api.getEventStream({
					deviceId: 'mine',
					name: 'test',
				}).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith('devices/events/test'));
				});
			});

			it('requests device\'s named events', () => {
				return api.getEventStream(props).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith(`${ props.deviceId }/events/${ props.name }`));
				});
			});

			it('requests org\'s events', () => {
				return api.getEventStream({ org: 'test-org' }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith('v1/orgs/test-org/events'));
				});
			});

			it('requests org\'s device events', () => {
				return api.getEventStream({ org: 'test-org', deviceId: props.deviceId as string }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith(`v1/orgs/test-org/devices/${props.deviceId}/events`));
				});
			});

			it('requests org\'s device named events', () => {
				return api.getEventStream({ org: 'test-org', deviceId: props.deviceId as string, name: 'test' }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith(`v1/orgs/test-org/devices/${props.deviceId}/events/test`));
				});
			});

			it('requests product\'s events', () => {
				return api.getEventStream({ org: 'test-org', product: 'test-product' }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith('v1/orgs/test-org/products/test-product/events'));
				});
			});

			it('requests product\'s named events', () => {
				return api.getEventStream({ org: 'test-org', product: 'test-product', name: 'test' }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith('v1/orgs/test-org/products/test-product/events/test'));
				});
			});

			it('requests a product\'s event without an org provided', () => {
				return api.getEventStream({ product: 'test-product' })
					.then(({ uri }) => {
						expect(uri).to.satisfy((s: string) => s.endsWith('v1/products/test-product/events'));
					});
			});

			it('requests a product\'s named event without an org provided', () => {
				return api.getEventStream({ product: 'test-product', name: 'foo' })
					.then(({ uri }) => {
						expect(uri).to.satisfy((s: string) => s.endsWith('v1/products/test-product/events/foo'));
					});
			});

			it('requests product\'s device events', () => {
				return api.getEventStream({ product: 'test-product', deviceId: props.deviceId as string }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith(`v1/products/test-product/devices/${props.deviceId}/events`));
				});
			});

			it('requests product\'s device named events', () => {
				return api.getEventStream({ product: 'test-product', deviceId: props.deviceId as string, name: 'foo' }).then(({ uri }) => {
					expect(uri).to.satisfy((s: string) => s.endsWith(`v1/products/test-product/devices/${props.deviceId}/events/foo`));
				});
			});

			it('calls _getActiveAuthToken(auth)', () => {
				const fakeToken = 'abc123';
				sinon.stub(api as object as ParticleInternal, '_getActiveAuthToken').returns(fakeToken);
				void api.getEventStream({});
				expect((api as object as ParticleInternal)._getActiveAuthToken).to.have.property('callCount', 1);
			});
		});

		describe('.publishEvent', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.publishEvent(a<Parameters<typeof api.publishEvent>[0]>(props)).then((results) => {
						expect(results).to.containSubset({
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
					return api.publishEvent(a<Parameters<typeof api.publishEvent>[0]>(propsWithProduct)).then((results) => {
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
								requestType: (props.hook as object as Record<string, object>).method,
								auth: (props.hook as object as Record<string, object>).auth,
								headers: (props.hook as object as Record<string, object>).headers,
								query: (props.hook as object as Record<string, object>).query,
								json: (props.hook as object as Record<string, object>).json,
								form: (props.hook as object as Record<string, object>).form,
								body: (props.hook as object as Record<string, object>).body,
								responseTemplate: (props.hook as object as Record<string, object>).responseTemplate,
								responseTopic: (props.hook as object as Record<string, object>).responseEvent,
								errorResponseTopic: (props.hook as object as Record<string, object>).errorResponseEvent,
							},
							context: {}
						});
					});
				});

				it('creates for user\'s devices', () => {
					const params: R = Object.assign({}, props);
					delete params.device;
					return api.createWebhook(a<Parameters<typeof api.createWebhook>[0]>(params)).then((results) => {
						expect(results).to.containSubset({
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
								requestType: (props.hook as object as Record<string, object>).method,
								auth: (props.hook as object as Record<string, object>).auth,
								headers: (props.hook as object as Record<string, object>).headers,
								query: (props.hook as object as Record<string, object>).query,
								json: (props.hook as object as Record<string, object>).json,
								form: (props.hook as object as Record<string, object>).form,
								body: (props.hook as object as Record<string, object>).body,
								responseTemplate: (props.hook as object as Record<string, object>).responseTemplate,
								responseTopic: (props.hook as object as Record<string, object>).responseEvent,
								errorResponseTopic: (props.hook as object as Record<string, object>).errorResponseEvent,
							},
							context: {}
						});
					});
				});

				it('creates using defaults', () => {
					const params: R = Object.assign({}, props);
					delete params.device;
					delete params.rejectUnauthorized;
					delete params.noDefaults;
					delete params.hook;
					delete params.headers;
					delete params.context;
					return api.createWebhook(a<Parameters<typeof api.createWebhook>[0]>(params)).then((results) => {
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
								requestType: (props.hook as object as Record<string, object>).method,
								auth: (props.hook as object as Record<string, object>).auth,
								headers: (props.hook as object as Record<string, object>).headers,
								query: (props.hook as object as Record<string, object>).query,
								json: (props.hook as object as Record<string, object>).json,
								form: (props.hook as object as Record<string, object>).form,
								body: (props.hook as object as Record<string, object>).body,
								responseTemplate: (props.hook as object as Record<string, object>).responseTemplate,
								responseTopic: (props.hook as object as Record<string, object>).responseEvent,
								errorResponseTopic: (props.hook as object as Record<string, object>).errorResponseEvent,
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
							method: 'post',
							uri: '/v1/integrations',
							auth: props.auth,
							data: {
								event: props.event,
								deviceid: props.deviceId,
								url: (props.settings as Record<string, string>).url,
							}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.createIntegration(propsWithProduct).then((results) => {
						expect(results).to.containSubset({
							method: 'post',
							uri: `/v1/products/${product}/integrations`,
							auth: props.auth,
							data: {
								event: props.event,
								deviceid: props.deviceId,
								url: (props.settings as Record<string, string>).url,
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
						expect(results).to.containSubset({
							method: 'put',
							uri: `/v1/integrations/${props.integrationId}`,
							auth: props.auth,
							data: {
								event: props.event,
								deviceid: props.deviceId,
								url: (props.settings as Record<string, string>).url,
							}
						});
					});
				});
			});

			describe('product scope', () => {
				it('generates request', () => {
					return api.editIntegration(propsWithProduct).then((results) => {
						expect(results).to.containSubset({
							method: 'put',
							uri: `/v1/products/${product}/integrations/${props.integrationId}`,
							auth: props.auth,
							data: {
								event: props.event,
								deviceid: props.deviceId,
								url: (props.settings as Record<string, string>).url,
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
				return api.listBuildTargets(props).then((_results) => {
					const { auth, query } = _results as object as R;
					expect(auth).to.equal(props.auth);
					expect(query).to.not.exist;
				});
			});

			it('passes featured flag', () => {
				const params = { auth: props.auth as string, onlyFeatured: true };
				return api.listBuildTargets(params).then((_results) => {
					const { auth, query } = _results as object as R;
					expect(auth).to.equal(props.auth);
					expect(query).to.deep.equal({ featured: true });
				});
			});
		});

		describe('.setUserInfo', () => {
			it('generates request', () => {
				return api.setUserInfo({ auth: 'X', accountInfo: { first_name: 'John', last_name: 'Scully' } })
					.then((results) => {
						expect(results).to.deep.equal({
							uri: '/v1/user',
							method: 'put',
							auth: 'X',
							headers: undefined,
							query: undefined,
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
						expect(results).to.deep.equal({
							uri: '/v1/user',
							method: 'put',
							auth: 'X',
							headers: undefined,
							query: undefined,
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
						expect(results).to.deep.equal({
							uri: '/v1/user',
							method: 'put',
							auth: 'X',
							headers: undefined,
							query: undefined,
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
						expect(results).to.deep.equal({
							uri: '/v1/user',
							method: 'put',
							auth: 'X',
							headers: undefined,
							query: undefined,
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
						expect(results).to.deep.equal({
							method: 'put',
							uri: '/v1/user',
							auth: 'X',
							headers: undefined,
							query: undefined,
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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

		describe('.removeSIM', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.removeSIM(props).then((results) => {
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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

		describe('.getSIMDataUsage', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.getSIMDataUsage(props).then((results) => {
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
				}).then((_results) => {
					const results = _results as object as R;
					expect(results.query).to.deep.equal({
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
					expect(results).to.containSubset({
						uri: '/v1/libraries/mylib',
						auth: 'X'
					});
				});
			});

			it('forwards query parameters', () => {
				return api.getLibrary({ name: 'mylib', auth: 'X', version: '1.2.0' }).then((_results) => {
					const results = _results as object as R;
					expect(results.query).to.deep.equal({
						version: '1.2.0'
					});
				});
			});
		});

		describe('.getLibraryVersions', () => {
			it('generates request', () => {
				return api.getLibraryVersions({ name: 'mylib', auth: 'X' }).then((results) => {
					expect(results).to.containSubset({
						uri: '/v1/libraries/mylib/versions',
						auth: 'X'
					});
				});
			});

			it('forwards query parameters', () => {
				return api.getLibraryVersions({ name: 'mylib', auth: 'X', page: 3 }).then((_results) => {
					const results = _results as object as R;
					expect(results.query).to.deep.equal({
						page: 3,
						limit: undefined
					});
				});
			});
		});

		describe('.contributeLibrary', () => {
			it('generates request', () => {
				const archive = Buffer.from('tarball');
				return api.contributeLibrary({ archive: archive, auth: 'X' }).then((results) => {
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
				sinon.stub(api, 'request').callsFake(x => Promise.resolve(x) as object as Promise<import('../src/types').RequestResponse>);
				const uri = 'http://example.com/path/to/file.png';
				const req = api.downloadFile({ uri });
				expect((api.request as sinon.SinonStub).callCount).to.equal(1);
				return req.then((results) => {
					expect(results).to.containSubset({ uri, method: 'get', isBuffer: true });
				});
			});
		});

		describe('.listOAuthClients', () => {
			describe('user scope', () => {
				it('generates request', () => {
					return api.listOAuthClients(props).then((results) => {
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
					return api.createOAuthClient(a<Parameters<typeof api.createOAuthClient>[0]>(props)).then((results) => {
						expect(results).to.containSubset({
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
					return api.createOAuthClient(a<Parameters<typeof api.createOAuthClient>[0]>(propsWithProduct)).then((results) => {
						expect(results).to.containSubset({
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
					return api.updateOAuthClient(a<Parameters<typeof api.updateOAuthClient>[0]>(props)).then((results) => {
						expect(results).to.containSubset({
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
					return api.updateOAuthClient(a<Parameters<typeof api.updateOAuthClient>[0]>(propsWithProduct)).then((results) => {
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
						expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
				return api.uploadProductFirmware(a<Parameters<typeof api.uploadProductFirmware>[0]>(propsWithProduct)).then((results) => {
					expect(results).to.containSubset({
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
				sinon.stub(api, 'request').callsFake(x => Promise.resolve(x) as object as Promise<import('../src/types').RequestResponse>);
				const req = api.downloadProductFirmware(a<Parameters<typeof api.downloadProductFirmware>[0]>(propsWithProduct));
				expect((api.request as sinon.SinonStub).callCount).to.equal(1);
				return req.then((results) => {
					expect(results).to.containSubset({
						uri: `/v1/products/${product}/firmware/${props.version}/binary`,
						method: 'get',
						auth: props.auth,
						headers: props.headers,
						context: undefined,
						isBuffer: true
					});
				});
			});
		});

		describe('.getProductFirmware', () => {
			it('generates request', () => {
				return api.getProductFirmware(a<Parameters<typeof api.getProductFirmware>[0]>(propsWithProduct)).then((results) => {
					expect(results).to.containSubset({
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
				return api.updateProductFirmware(a<Parameters<typeof api.updateProductFirmware>[0]>(propsWithProduct)).then((results) => {
					expect(results).to.containSubset({
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
				return api.releaseProductFirmware(a<Parameters<typeof api.releaseProductFirmware>[0]>(propsWithProduct)).then((results) => {
					expect(results).to.containSubset({
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
			it('generates request with product_default, groups and intelligent', () => {
				return api.releaseProductFirmware({
					product,
					version: 42,
					product_default: true,
					groups: ['foo', 'bar'],
					intelligent: true,
					auth: props.auth
				}).then((_results) => {
					const results = _results as object as R;
					expect(results).to.containSubset({
						uri: `/v1/products/${product}/firmware/release`,
						method: 'put',
						data: {
							version: 42,
							product_default: true,
							groups: ['foo', 'bar'],
							intelligent: true
						}
					});
				});
			});
		});

		describe('.listTeamMembers', () => {
			it('generates request', () => {
				return api.listTeamMembers(propsWithProduct).then((results) => {
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
				const p: R = Object.assign({}, props);
				delete p.networkId;
				return api.removeMeshNetworkDevice(a<Parameters<typeof api.removeMeshNetworkDevice>[0]>(p)).then((results) => {
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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
					expect(results).to.containSubset({
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

		describe('.executeLogic', () => {
			it('generates org request', () => {
				return api.executeLogic(a<Parameters<typeof api.executeLogic>[0]>(propsWithOrg)).then((results) => {
					expect(results).to.containSubset({
						method: 'post',
						uri: `/v1/orgs/${org}/logic/execute`,
						auth: props.auth,
						data: props.logic
					});
				});
			});

			it('generates user request', () => {
				return api.executeLogic(a<Parameters<typeof api.executeLogic>[0]>(props)).then((results) => {
					expect(results).to.containSubset({
						method: 'post',
						uri: '/v1/logic/execute',
						auth: props.auth,
						data: props.logic
					});
				});
			});
		});

		describe('.createLogicFunction', () => {
			it('generates request', () => {
				return api.createLogicFunction(a<Parameters<typeof api.createLogicFunction>[0]>(propsWithOrg)).then((results) => {
					expect(results).to.containSubset({
						method: 'post',
						uri: `/v1/orgs/${org}/logic/functions`,
						auth: props.auth,
						data: {
							logic_function: props.logicFunction
						}
					});
				});
			});
		});

		describe('.getLogicFunction', () => {
			it('generates request', () => {
				return api.getLogicFunction(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/logic/functions/${props.logicFunctionId}`,
						auth: props.auth
					});
				});
			});
		});

		describe('.updateLogicFunction', () => {
			it('generates request', () => {
				return api.updateLogicFunction(a<Parameters<typeof api.updateLogicFunction>[0]>(propsWithOrg)).then((results) => {
					expect(results).to.containSubset({
						method: 'put',
						uri: `/v1/orgs/${org}/logic/functions/${props.logicFunctionId}`,
						auth: props.auth,
						data: {
							logic_function: props.logicFunction
						}
					});
				});
			});
		});

		describe('.deleteLogicFunction', () => {
			it('generates request', () => {
				return api.deleteLogicFunction(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'delete',
						uri: `/v1/orgs/${org}/logic/functions/${props.logicFunctionId}`,
						auth: props.auth
					});
				});
			});
		});

		describe('.listLogicFunctions', () => {
			it('generates request', () => {
				return api.listLogicFunctions(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/logic/functions`,
						auth: props.auth
					});
				});
			});
		});

		describe('.listLogicRuns', () => {
			it('generates request', () => {
				return api.listLogicRuns(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/logic/functions/${props.logicFunctionId}/runs`,
						auth: props.auth,
					});
				});
			});
		});

		describe('.getLogicRun', () => {
			it('generates request', () => {
				return api.getLogicRun(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/logic/functions/${props.logicFunctionId}/runs/${props.logicRunId}`,
						auth: props.auth,
					});
				});
			});
		});

		describe('.getLogicRunLogs', () => {
			it('generates request', () => {
				return api.getLogicRunLogs(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/logic/functions/${props.logicFunctionId}/runs/${props.logicRunId}/logs`,
						auth: props.auth,
					});
				});
			});
		});

		describe('.deleteUser', () => {
			it('sends request to delete the current user', () => {
				return api.deleteUser(props).then(result => {
					expect(result).to.containSubset({
						context: {},
						data: { password: props.password },
						method: 'delete',
						uri: '/v1/user',
						auth: props.auth
					});
				});
			});
		});

		describe('.createLedger', () => {
			it('generates request', () => {
				return api.createLedger(a<Parameters<typeof api.createLedger>[0]>(propsWithOrg)).then((results) => {
					expect(results).to.containSubset({
						method: 'post',
						uri: `/v1/orgs/${org}/ledgers`,
						auth: props.auth,
						data: {
							ledger: props.ledger
						}
					});
				});
			});
		});

		describe('.getLedger', () => {
			it('generates request', () => {
				return api.getLedger(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/ledgers/${props.ledgerName}`,
						auth: props.auth
					});
				});
			});
		});

		describe('.updateLedger', () => {
			it('generates request', () => {
				return api.updateLedger(a<Parameters<typeof api.updateLedger>[0]>(propsWithOrg)).then((results) => {
					expect(results).to.containSubset({
						method: 'put',
						uri: `/v1/orgs/${org}/ledgers/${props.ledgerName}`,
						auth: props.auth,
						data: {
							ledger: props.ledger
						}
					});
				});
			});
		});

		describe('.archiveLedger', () => {
			it('generates request', () => {
				return api.archiveLedger(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'delete',
						uri: `/v1/orgs/${org}/ledgers/${props.ledgerName}`,
						auth: props.auth
					});
				});
			});
		});

		describe('.listLedgers', () => {
			it('generates request', () => {
				return api.listLedgers(a<Parameters<typeof api.listLedgers>[0]>(propsWithOrg)).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/ledgers`,
						auth: props.auth
					});
				});
			});
		});

		describe('.getLedgerInstance', () => {
			it('generates request', () => {
				return api.getLedgerInstance(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/ledgers/${props.ledgerName}/instances/${props.scopeValue}`,
						auth: props.auth
					});
				});
			});
		});

		describe('.setLedgerInstance', () => {
			it('generates request', () => {
				return api.setLedgerInstance(a<Parameters<typeof api.setLedgerInstance>[0]>(propsWithOrg)).then((results) => {
					expect(results).to.containSubset({
						method: 'put',
						uri: `/v1/orgs/${org}/ledgers/${props.ledgerName}/instances/${props.scopeValue}`,
						query: {
							set_mode: props.setMode
						},
						auth: props.auth,
						data: {
							instance: props.instance
						}
					});
				});
			});
		});

		describe('.deleteLedgerInstance', () => {
			it('generates request', () => {
				return api.deleteLedgerInstance(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'delete',
						uri: `/v1/orgs/${org}/ledgers/${props.ledgerName}/instances/${props.scopeValue}`,
						auth: props.auth
					});
				});
			});
		});

		describe('.listLedgerInstances', () => {
			it('generates request', () => {
				return api.listLedgerInstances(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/ledgers/${props.ledgerName}/instances`,
						auth: props.auth
					});
				});
			});
		});

		describe('listLedgerInstanceVersions', () => {
			it('generates request', () => {
				return api.listLedgerInstanceVersions(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/ledgers/${props.ledgerName}/instances/${props.scopeValue}/versions`,
						auth: props.auth
					});
				});
			});
		});

		describe('.getLedgerInstanceVersion', () => {
			it('generates request', () => {
				return api.getLedgerInstanceVersion(propsWithOrg).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/ledgers/${props.ledgerName}/instances/${props.scopeValue}/versions/${props.version}`,
						auth: props.auth
					});
				});
			});
		});

		describe('.listDeviceOsVersions', () => {
			it('generates request without optional parameters', () => {
				return api.listDeviceOsVersions({ auth: props.auth as string }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: '/v1/device-os/versions',
						auth: props.auth,
						query: {}
					});
				});
			});

			it('generates request with all optional parameters', () => {
				const options = {
					auth: props.auth as string,
					platformId: 6,
					internalVersion: '1.2.3',
					page: 2,
					perPage: 25
				};
				return api.listDeviceOsVersions(a<Parameters<typeof api.listDeviceOsVersions>[0]>(options)).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: '/v1/device-os/versions',
						auth: props.auth,
						query: {
							platform_id: 6,
							internal_version: '1.2.3',
							page: 2,
							per_page: 25
						}
					});
				});
			});
		});

		describe('.getDeviceOsVersion', () => {
			it('generates request without optional parameters', () => {
				const options = {
					auth: props.auth as string,
					version: '1.2.3'
				};
				return api.getDeviceOsVersion(options).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: '/v1/device-os/versions/1.2.3',
						auth: props.auth,
						query: {}
					});
				});
			});

			it('generates request with platformId parameter', () => {
				const options = {
					auth: props.auth as string,
					version: '1.2.3',
					platformId: 6
				};
				return api.getDeviceOsVersion(options).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: '/v1/device-os/versions/1.2.3',
						auth: props.auth,
						query: {
							platform_id: 6
						}
					});
				});
			});
		});

		describe('.listEnvVars', () => {
			it('generates request for sandbox scope', () => {
				return api.listEnvVars({ auth: props.auth as string, sandbox: true }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: '/v1/env',
						auth: props.auth
					});
				});
			});

			it('generates request for device scope', () => {
				return api.listEnvVars({ auth: props.auth as string, deviceId: props.deviceId }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/env/${props.deviceId}`,
						auth: props.auth
					});
				});
			});

			it('generates request for product scope', () => {
				return api.listEnvVars({ auth: props.auth as string, product }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/products/${product}/env`,
						auth: props.auth
					});
				});
			});

			it('generates request for org scope', () => {
				return api.listEnvVars({ auth: props.auth as string, org }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/env`,
						auth: props.auth
					});
				});
			});

			it('throws when no scope is specified', () => {
				expect(() => api.listEnvVars({ auth: props.auth as string })).to.throw('Specify one of');
			});

			it('throws when multiple scopes are specified', () => {
				expect(() => api.listEnvVars({ auth: props.auth as string, product, org })).to.throw('Specify only one of');
			});
		});

		describe('.updateEnvVars', () => {
			it('generates request for sandbox scope', () => {
				return api.updateEnvVars({ auth: props.auth as string, sandbox: true, ops: props.envVarOps as EnvVarOp[] }).then((results) => {
					expect(results).to.containSubset({
						method: 'patch',
						uri: '/v1/env',
						auth: props.auth,
						data: { ops: props.envVarOps }
					});
				});
			});

			it('generates request for device scope', () => {
				return api.updateEnvVars({ auth: props.auth as string, deviceId: props.deviceId, ops: props.envVarOps as EnvVarOp[] }).then((results) => {
					expect(results).to.containSubset({
						method: 'patch',
						uri: `/v1/env/${props.deviceId}`,
						auth: props.auth,
						data: { ops: props.envVarOps }
					});
				});
			});

			it('generates request for product scope', () => {
				return api.updateEnvVars({ auth: props.auth as string, product, ops: props.envVarOps as EnvVarOp[] }).then((results) => {
					expect(results).to.containSubset({
						method: 'patch',
						uri: `/v1/products/${product}/env`,
						auth: props.auth,
						data: { ops: props.envVarOps }
					});
				});
			});

			it('generates request for org scope', () => {
				return api.updateEnvVars({ auth: props.auth as string, org, ops: props.envVarOps as EnvVarOp[] }).then((results) => {
					expect(results).to.containSubset({
						method: 'patch',
						uri: `/v1/orgs/${org}/env`,
						auth: props.auth,
						data: { ops: props.envVarOps }
					});
				});
			});

			it('throws when no scope is specified', () => {
				expect(() => api.updateEnvVars({ auth: props.auth as string, ops: props.envVarOps as EnvVarOp[] })).to.throw('Specify one of');
			});

			it('throws when multiple scopes are specified', () => {
				expect(() => api.updateEnvVars({ auth: props.auth as string, product, org, ops: props.envVarOps as EnvVarOp[] })).to.throw('Specify only one of');
			});
		});

		describe('.setEnvVar', () => {
			it('generates request for sandbox scope', () => {
				return api.setEnvVar({ auth: props.auth as string, sandbox: true, key: props.envVarKey, value: props.envVarValue }).then((results) => {
					expect(results).to.containSubset({
						method: 'put',
						uri: `/v1/env/${props.envVarKey}`,
						auth: props.auth,
						data: { value: props.envVarValue }
					});
				});
			});

			it('generates request for device scope', () => {
				return api.setEnvVar({ auth: props.auth as string, deviceId: props.deviceId, key: props.envVarKey, value: props.envVarValue }).then((results) => {
					expect(results).to.containSubset({
						method: 'put',
						uri: `/v1/env/${props.deviceId}/${props.envVarKey}`,
						auth: props.auth,
						data: { value: props.envVarValue }
					});
				});
			});

			it('generates request for product scope', () => {
				return api.setEnvVar({ auth: props.auth as string, product, key: props.envVarKey, value: props.envVarValue }).then((results) => {
					expect(results).to.containSubset({
						method: 'put',
						uri: `/v1/products/${product}/env/${props.envVarKey}`,
						auth: props.auth,
						data: { value: props.envVarValue }
					});
				});
			});

			it('generates request for org scope', () => {
				return api.setEnvVar({ auth: props.auth as string, org, key: props.envVarKey, value: props.envVarValue }).then((results) => {
					expect(results).to.containSubset({
						method: 'put',
						uri: `/v1/orgs/${org}/env/${props.envVarKey}`,
						auth: props.auth,
						data: { value: props.envVarValue }
					});
				});
			});

			it('throws when no scope is specified', () => {
				expect(() => api.setEnvVar({ auth: props.auth as string, key: props.envVarKey, value: props.envVarValue })).to.throw('Specify one of');
			});

			it('throws when multiple scopes are specified', () => {
				expect(() => api.setEnvVar({ auth: props.auth as string, product, org, key: props.envVarKey, value: props.envVarValue })).to.throw('Specify only one of');
			});
		});

		describe('.deleteEnvVar', () => {
			it('generates request for sandbox scope', () => {
				return api.deleteEnvVar({ auth: props.auth as string, sandbox: true, key: props.envVarKey }).then((results) => {
					expect(results).to.containSubset({
						method: 'delete',
						uri: `/v1/env/${props.envVarKey}`,
						auth: props.auth
					});
				});
			});

			it('generates request for device scope', () => {
				return api.deleteEnvVar({ auth: props.auth as string, deviceId: props.deviceId, key: props.envVarKey }).then((results) => {
					expect(results).to.containSubset({
						method: 'delete',
						uri: `/v1/env/${props.deviceId}/${props.envVarKey}`,
						auth: props.auth
					});
				});
			});

			it('generates request for product scope', () => {
				return api.deleteEnvVar({ auth: props.auth as string, product, key: props.envVarKey }).then((results) => {
					expect(results).to.containSubset({
						method: 'delete',
						uri: `/v1/products/${product}/env/${props.envVarKey}`,
						auth: props.auth
					});
				});
			});

			it('generates request for org scope', () => {
				return api.deleteEnvVar({ auth: props.auth as string, org, key: props.envVarKey }).then((results) => {
					expect(results).to.containSubset({
						method: 'delete',
						uri: `/v1/orgs/${org}/env/${props.envVarKey}`,
						auth: props.auth
					});
				});
			});

			it('throws when no scope is specified', () => {
				expect(() => api.deleteEnvVar({ auth: props.auth as string, key: props.envVarKey })).to.throw('Specify one of');
			});

			it('throws when multiple scopes are specified', () => {
				expect(() => api.deleteEnvVar({ auth: props.auth as string, product, org, key: props.envVarKey })).to.throw('Specify only one of');
			});
		});

		describe('.renderEnvVars', () => {
			it('generates request for sandbox scope', () => {
				return api.renderEnvVars({ auth: props.auth as string, sandbox: true }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: '/v1/env/render',
						auth: props.auth
					});
				});
			});

			it('generates request for device scope', () => {
				return api.renderEnvVars({ auth: props.auth as string, deviceId: props.deviceId }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/env/${props.deviceId}/render`,
						auth: props.auth
					});
				});
			});

			it('generates request for product scope', () => {
				return api.renderEnvVars({ auth: props.auth as string, product }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/products/${product}/env/render`,
						auth: props.auth
					});
				});
			});

			it('generates request for org scope', () => {
				return api.renderEnvVars({ auth: props.auth as string, org }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/env/render`,
						auth: props.auth
					});
				});
			});

			it('throws when no scope is specified', () => {
				expect(() => api.renderEnvVars({ auth: props.auth as string })).to.throw('Specify one of');
			});

			it('throws when multiple scopes are specified', () => {
				expect(() => api.renderEnvVars({ auth: props.auth as string, product, org })).to.throw('Specify only one of');
			});
		});

		describe('.reviewEnvVarsRollout', () => {
			it('generates request for sandbox scope', () => {
				return api.reviewEnvVarsRollout({ auth: props.auth as string, sandbox: true }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: '/v1/env/rollout',
						auth: props.auth
					});
				});
			});

			it('generates request for device scope', () => {
				return api.reviewEnvVarsRollout({ auth: props.auth as string, deviceId: props.deviceId }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/env/${props.deviceId}/rollout`,
						auth: props.auth
					});
				});
			});

			it('generates request for product scope', () => {
				return api.reviewEnvVarsRollout({ auth: props.auth as string, product }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/products/${product}/env/rollout`,
						auth: props.auth
					});
				});
			});

			it('generates request for org scope', () => {
				return api.reviewEnvVarsRollout({ auth: props.auth as string, org }).then((results) => {
					expect(results).to.containSubset({
						method: 'get',
						uri: `/v1/orgs/${org}/env/rollout`,
						auth: props.auth
					});
				});
			});

			it('throws when no scope is specified', () => {
				expect(() => api.reviewEnvVarsRollout({ auth: props.auth as string })).to.throw('Specify one of');
			});

			it('throws when multiple scopes are specified', () => {
				expect(() => api.reviewEnvVarsRollout({ auth: props.auth as string, product, org })).to.throw('Specify only one of');
			});
		});

		describe('.startEnvVarsRollout', () => {
			it('generates request for sandbox scope', () => {
				return api.startEnvVarsRollout({ auth: props.auth as string, sandbox: true, when: 'Immediate' }).then((results) => {
					expect(results).to.containSubset({
						method: 'post',
						uri: '/v1/env/rollout',
						auth: props.auth,
						data: { when: 'Immediate' }
					});
				});
			});

			it('generates request for device scope', () => {
				return api.startEnvVarsRollout({ auth: props.auth as string, deviceId: props.deviceId, when: 'Connect' }).then((results) => {
					expect(results).to.containSubset({
						method: 'post',
						uri: `/v1/env/${props.deviceId}/rollout`,
						auth: props.auth,
						data: { when: 'Connect' }
					});
				});
			});

			it('generates request for product scope', () => {
				return api.startEnvVarsRollout({ auth: props.auth as string, product, when: 'Immediate' }).then((results) => {
					expect(results).to.containSubset({
						method: 'post',
						uri: `/v1/products/${product}/env/rollout`,
						auth: props.auth,
						data: { when: 'Immediate' }
					});
				});
			});

			it('generates request for org scope', () => {
				return api.startEnvVarsRollout({ auth: props.auth as string, org, when: 'Immediate' }).then((results) => {
					expect(results).to.containSubset({
						method: 'post',
						uri: `/v1/orgs/${org}/env/rollout`,
						auth: props.auth,
						data: { when: 'Immediate' }
					});
				});
			});

			it('throws when no scope is specified', () => {
				expect(() => api.startEnvVarsRollout({ auth: props.auth as string, when: 'Immediate' })).to.throw('Specify one of');
			});

			it('throws when multiple scopes are specified', () => {
				expect(() => api.startEnvVarsRollout({ auth: props.auth as string, product, org, when: 'Immediate' })).to.throw('Specify only one of');
			});
		});

		describe('.unprotectDevice', () => {
			it('generates request', () => {
				return api.unprotectDevice(a<Parameters<typeof api.unprotectDevice>[0]>(Object.assign({}, propsWithProduct, {
					action: 'action',
					deviceNonce: 'device-nonce',
					serverNonce: 'server-nonce',
					deviceSignature: 'device-signature',
					devicePublicKeyFingerprint: 'device-public-key-fingerprint'
				}))).then((results) => {
					expect(results).to.containSubset({
						method: 'put',
						uri: `/v1/products/${product}/devices/${props.deviceId}/unprotect`,
						auth: props.auth,
						headers: props.headers,
						data: {
							action: 'action',
							device_nonce: 'device-nonce',
							server_nonce: 'server-nonce',
							device_signature: 'device-signature',
							device_public_key_fingerprint: 'device-public-key-fingerprint'
						}
					});
				});
			});
		});
	});

	describe('.deviceUri', () => {
		describe('user scope', () => {
			it('gets the user device uri', () => {
				const uri = api.deviceUri({ deviceId: 'abc' });
				expect(uri).to.equal('/v1/devices/abc');
			});
		});
		describe('product scope', () => {
			it('gets the product device uri', () => {
				const uri = api.deviceUri({ deviceId: 'abc', product: 'xyz' });
				expect(uri).to.equal('/v1/products/xyz/devices/abc');
			});
		});
		describe('org scope', () => {
			it('gets the org device uri', () => {
				const uri = api.deviceUri({ deviceId: 'abc', org: 'xyz' });
				expect(uri).to.equal('/v1/orgs/xyz/devices/abc');
			});
		});
	});


	describe('.client', () => {
		it('creates a client', () => {
			expect(api.client()).to.be.instanceOf(Client);
		});
		it('passes the api', () => {
			expect(api.client().api).to.equal(api);
		});
	});

	describe('context', () => {
		describe('_isValidContext', () => {
			it('does not have context items set after default construction', () => {
				const api = new Particle();
				expect(api).to.have.property('context').eql({});
			});

			it('is valid for known types and non-empty object', () => {
				expect((api as object as ParticleInternal)._isValidContext('tool', { abc:'123' } as object as ToolContext)).to.be.ok;
				expect((api as object as ParticleInternal)._isValidContext('project', { abc:'123' } as object as ProjectContext)).to.be.ok;
			});

			it('is not valid for unknown types and non-empty object', () => {
				expect((api as object as ParticleInternal)._isValidContext('tool1', { abc:'123' } as object as ToolContext)).to.not.be.ok;
				expect((api as object as ParticleInternal)._isValidContext('project1', { abc:'123' } as object as ProjectContext)).to.not.be.ok;
			});

			it('is not valid for known types and falsey object', () => {
				expect((api as object as ParticleInternal)._isValidContext('tool', {} as object as ToolContext)).to.be.ok;
				expect((api as object as ParticleInternal)._isValidContext('tool', a<undefined>(0))).to.be.ok;
				expect((api as object as ParticleInternal)._isValidContext('tool', a<undefined>(null))).to.be.ok;
				expect((api as object as ParticleInternal)._isValidContext('tool', undefined)).to.not.be.ok;
			});

			it('sets a valid context', () => {
				api.setContext('tool', { name:'spanner' });
				expect(api.context).to.have.nested.property('tool.name', 'spanner');
			});
		});

		describe('_buildContext', () => {
			it('uses the api context when no context provided', () => {
				const tool = { name:'spanner' };
				api.setContext('tool', tool);
				expect((api as object as ParticleInternal)._buildContext(undefined)).to.deep.equal({ tool });
			});

			it('overrides the api context completely for a given context item', () => {
				const tool = { name:'spanner', version:'1.2.3' };
				api.setContext('tool', tool);
				const newTool = { name:'pliers' };
				expect((api as object as ParticleInternal)._buildContext({ tool:newTool })).to.deep.equal({ tool:newTool });
			});
		});

		describe('agent forwarders', () => {
			let uri: string, auth: string, headers: Record<string, string>, query: string, data: Record<string, boolean>, context: Record<string, number>, contextResult: Record<string, number>, result: string;

			beforeEach(() => {
				uri = 'http://example.com/v1';
				auth = 'fake-token';
				headers = { 'X-FOO': 'foo', 'X-BAR': 'bar' };
				query = 'foo=1&bar=2';
				data = { foo: true, bar: false };
				context = { abc: 123 };
				contextResult = { def: 456 };
				result = 'fake-result';
				(api as object as ParticleInternal)._buildContext = sinon.stub().returns(contextResult) as object as ParticleInternal['_buildContext'];
				(api as object as ParticleInternal)._getActiveAuthToken = sinon.stub().returns(auth) as object as ParticleInternal['_getActiveAuthToken'];
			});

			afterEach(() => {
				expect((api as object as ParticleInternal)._buildContext).to.have.been.calledWith(context);
				expect((api as object as ParticleInternal)._getActiveAuthToken).to.have.been.calledWith(auth);
			});

			it('calls _buildContext and _getActiveAuthToken from get', () => {
				api.agent.get = sinon.stub().returns(result) as object as typeof api.agent.get;
				const options = { uri, auth, headers, query, context };
				const res = api.get(options as object as Parameters<typeof api.get>[0]);
				expect(res).to.equal(result);
				expect(api.agent.get).to.have.been.calledWith({
					uri,
					auth,
					headers,
					query,
					context: contextResult
				});
			});

			it('calls _buildContext and _getActiveAuthToken from head', () => {
				api.agent.head = sinon.stub().returns(result) as object as typeof api.agent.head;
				const options = { uri, auth, headers, query, context };
				const res = api.head(options as object as Parameters<typeof api.head>[0]);
				expect(res).to.equal(result);
				expect(api.agent.head).to.have.been.calledWith({
					uri,
					auth,
					headers,
					query,
					context: contextResult
				});
			});

			it('calls _buildContext and _getActiveAuthToken from post', () => {
				api.agent.post = sinon.stub().returns(result) as object as typeof api.agent.post;
				const options = { uri, auth, headers, data, context };
				const res = api.post(options as object as Parameters<typeof api.post>[0]);
				expect(res).to.equal(result);
				expect(api.agent.post).to.have.been.calledWith({
					uri,
					auth,
					headers,
					data,
					context: contextResult
				});
			});

			it('calls _buildContext and _getActiveAuthToken from put', () => {
				api.agent.put = sinon.stub().returns(result) as object as typeof api.agent.put;
				const options = { uri, auth, headers, data, context, query };
				const res = api.put(options as object as Parameters<typeof api.put>[0]);
				expect(res).to.equal(result);
				expect(api.agent.put).to.have.been.calledWith({
					uri,
					auth,
					headers,
					data,
					query,
					context: contextResult
				});
			});

			it('calls _buildContext and _getActiveAuthToken from delete', () => {
				api.agent.delete = sinon.stub().returns(result) as object as typeof api.agent.delete;
				const options = { uri, auth, headers, data, context };
				const res = api.delete(options as object as Parameters<typeof api.delete>[0]);
				expect(res).to.equal(result);
				expect(api.agent.delete).to.have.been.calledWith({
					uri,
					auth,
					headers,
					data,
					context: contextResult
				});
			});

			it('calls _buildContext and _getActiveAuthToken from request', () => {
				api.agent.request = sinon.stub().returns(result) as object as typeof api.agent.request;
				expect(api.request({ context, auth } as object as Parameters<Particle['request']>[0])).to.equal(result);
				expect(api.agent.request).to.have.been.calledWith({ context:contextResult, auth });
			});
		});
	});

	describe('setBaseUrl(baseUrl)', () => {
		afterEach(() => {
			sinon.restore();
		});

		it('sets baseUrl instance property', () => {
			const baseUrl = 'foo';
			api.setBaseUrl(baseUrl);
			expect(api.baseUrl).to.eql(baseUrl);
		});

		it('calls agent.setBaseUrl', () => {
			const baseUrl = 'foo';
			sinon.stub(api.agent, 'setBaseUrl');
			api.setBaseUrl(baseUrl);
			expect(api.agent.setBaseUrl).to.have.property('callCount', 1);
			expect((api.agent.setBaseUrl as sinon.SinonStub).firstCall.args).to.have.lengthOf(1);
			expect((api.agent.setBaseUrl as sinon.SinonStub).firstCall.args[0]).to.eql(baseUrl);
		});
	});

	describe('setDefaultAuth(auth)', () => {
		afterEach(() => {
			sinon.restore();
		});

		it('sets ._defaultAuth', () => {
			const auth = 'foo';
			api.setDefaultAuth(auth);
			expect(api._defaultAuth).to.eql(auth);
		});

		it('throws error unless given a non-empty string', () => {
			let error: Error | undefined;
			try {
				api.setDefaultAuth(a<string>(undefined));
			} catch (e) {
				error = e as Error;
			}
			expect(error).to.be.an.instanceOf(Error);
			expect(error!.message).to.eql('Must pass a non-empty string representing an auth token!');
		});
	});

	describe('_getActiveAuthToken(auth)', () => {
		afterEach(() => {
			sinon.restore();
		});

		it('returns provided value when provided value is truthy', () => {
			const expectedReturnValue = 'pass through';
			expect((api as object as ParticleInternal)._getActiveAuthToken(expectedReturnValue)).to.eql(expectedReturnValue);
		});

		it('returns value of _defaultAuth when provided value is NOT truthy', () => {
			const providedValue = undefined;
			const expectedReturnValue = 'default auth value';
			api.setDefaultAuth(expectedReturnValue);
			expect((api as object as ParticleInternal)._getActiveAuthToken(providedValue)).to.eql(expectedReturnValue);
		});

		it('returns undefined when both provided value and _defaultAuth are NOT truthy', () => {
			const providedValue = undefined;
			const expectedReturnValue = undefined;
			(api as object as ParticleInternal)._defaultAuth = undefined;
			expect((api as object as ParticleInternal)._getActiveAuthToken(providedValue)).to.eql(expectedReturnValue);
		});
	});
});
