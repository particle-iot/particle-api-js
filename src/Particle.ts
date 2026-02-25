import Defaults = require('./Defaults');
import EventStream = require('./EventStream');
import Agent = require('./Agent');
import Client = require('./Client');

// Define interfaces locally since modules use export = syntax
interface ParticleDefaults {
	baseUrl: string;
	clientSecret: string;
	clientId: string;
	tokenDuration: number;
	auth?: string;
}

type RequestResponse = any; // Simplified for now
type RequestError = any;    // Simplified for now

interface ToolContext {
	name?: string;
	version?: string;
	components?: Array<{
		name: string;
		version?: string;
	}>;
}

interface ProjectContext {
	name?: string;
	[key: string]: string | number | undefined;
}

/**
 * Particle Cloud API wrapper.
 *
 * See <https://docs.particle.io/reference/javascript/> for examples
 * of using the `Particle` class.
 *
 * Most Particle methods take a single unnamed argument object documented as
 * `options` with key/value pairs for each option.
 */
interface ParticleOptions extends Partial<ParticleDefaults> {
	auth?: string;
	context?: {
		tool?: ToolContext;
		project?: ProjectContext;
	};
}

interface ParticleContext {
	tool?: ToolContext;
	project?: ProjectContext;
}

class Particle implements ParticleDefaults {
	public baseUrl!: string;
	public clientSecret!: string;
	public clientId!: string;
	public tokenDuration!: number;
	public auth?: string;
	private agent!: Agent;
	private context: ParticleContext = {};

	/**
	 * Constructor for the Cloud API wrapper.
	 *
	 * Create a new Particle object and call methods below on it.
	 */
	constructor(options: ParticleOptions = {}) {
		// Apply defaults first, then options
		Object.assign(this, Defaults, options);

		if (options.auth) {
			this.setDefaultAuth(options.auth);
		}

		this.context = {};

		this.agent = new Agent(this.baseUrl);
	}

	private _isValidContext(name: string, context: any): boolean {
		return (name === 'tool' || name === 'project') && context !== undefined;
	}

	/**
	 * Allows setting a tool or project context which will be sent as headers with every request.
	 */
	setContext(name: 'tool' | 'project', context: ToolContext | ProjectContext | undefined): void {
		if (context !== undefined) {
			if (this._isValidContext(name, context)) {
				this.context[name] = context as any;
			} else {
				throw Error('unknown context name or undefined context: ' + name);
			}
		}
	}

	/**
	 * Builds the final context from the context parameter and the context items in the api.
	 */
	private _buildContext(context?: ParticleContext): ParticleContext {
		return Object.assign({}, this.context, context);
	}

	/**
	 * Login to Particle Cloud using an existing Particle account.
	 */
	login({
		username,
		password,
		tokenDuration = this.tokenDuration,
		headers,
		context
	}: {
		username: string;
		password: string;
		tokenDuration?: number;
		headers?: Record<string, string>;
		context?: ParticleContext;
	}): Promise<RequestResponse> {
		return this.request({
			uri: '/oauth/token',
			method: 'POST',
			data: {
				client_id: this.clientId,
				client_secret: this.clientSecret,
				grant_type: 'password',
				username: username,
				password: password,
				expires_in: tokenDuration
			},
			headers,
			context: this._buildContext(context)
		});
	}

	/**
	 * Sets the default authentication token for all requests.
	 */
	setDefaultAuth(auth: string): void {
		this.auth = auth;
	}

	/**
	 * Gets the active auth token from either the parameter or the default.
	 */
	private _getActiveAuthToken(auth?: string): string {
		if (auth) {
			return auth;
		}
		if (this.auth) {
			return this.auth;
		}
		throw new Error('No auth token provided');
	}

	/**
	 * Make a generic HTTP request to the Particle API.
	 */
	request(options: {
		uri: string;
		method?: string;
		data?: any;
		auth?: string;
		headers?: Record<string, string>;
		query?: Record<string, any>;
		form?: Record<string, any>;
		files?: Record<string, any>;
		context?: ParticleContext;
		isBuffer?: boolean;
	}): Promise<RequestResponse> {
		const { context, ...agentOptions } = options;
		return this.agent.request({
			...agentOptions,
			context: this._buildContext(context)
		});
	}

	/**
	 * Create an event stream for listening to server-sent events.
	 */
	getEventStream({
		deviceId,
		name,
		auth,
		context
	}: {
		deviceId?: string;
		name?: string;
		auth?: string;
		context?: ParticleContext;
	} = {}): Promise<EventStream> {
		let uri = '/v1/events';

		if (deviceId) {
			uri += `/devices/${encodeURIComponent(deviceId)}`;
		}
		if (name) {
			uri += `/${encodeURIComponent(name)}`;
		}

		const activeAuth = this._getActiveAuthToken(auth);
		return new EventStream(`${this.baseUrl}${uri}`, activeAuth).connect();
	}

	// TODO: Add remaining methods from the original Particle.js file
	// This is a partial conversion to get the compilation working
}

export = Particle;
