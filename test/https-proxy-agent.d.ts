declare module 'https-proxy-agent' {
	import { Agent } from 'http';
	export class HttpsProxyAgent extends Agent {
		constructor(proxy: string | URL);
	}
}
