import * as http from 'http';
import * as net from 'net';
import { expect } from './test-setup';
import Particle from '../src/Particle';

describe('Proxy support', () => {
	let proxyServer: http.Server;
	let proxyPort: number;
	let connectRequests: string[];
	let sockets: net.Socket[];

	beforeEach((done) => {
		connectRequests = [];
		sockets = [];

		proxyServer = http.createServer((_req, res) => {
			res.writeHead(405);
			res.end();
		});

		proxyServer.on('connect', (req: http.IncomingMessage, clientSocket: net.Socket, head: Buffer) => {
			const target = req.url || '';
			connectRequests.push(target);

			const [hostname, port] = target.split(':');
			const targetPort = parseInt(port, 10) || 443;

			const serverSocket = net.connect(targetPort, hostname, () => {
				clientSocket.write(
					'HTTP/1.1 200 Connection Established\r\n' +
					'\r\n'
				);
				serverSocket.write(head as Uint8Array);
				serverSocket.pipe(clientSocket);
				clientSocket.pipe(serverSocket);
			});

			sockets.push(clientSocket, serverSocket);

			serverSocket.on('error', () => {
				clientSocket.end();
			});

			clientSocket.on('error', () => {
				serverSocket.destroy();
			});
		});

		proxyServer.listen(0, () => {
			const addr = proxyServer.address() as net.AddressInfo;
			proxyPort = addr.port;
			done();
		});
	});

	afterEach((done) => {
		for (const socket of sockets) {
			socket.destroy();
		}
		proxyServer.close(done);
	});

	it('routes HTTPS requests through the proxy agent', async function () {
		this.timeout(10000);
		this.retries(3);

		const { HttpsProxyAgent } = await import('https-proxy-agent');
		const httpAgent = new HttpsProxyAgent(`http://localhost:${proxyPort}`);
		const particle = new Particle({ httpAgent });

		try {
			await particle.listDevices({ auth: 'invalid-token' });
		} catch (_err) {
			// Expected to fail with 401 - we just need the request to go through the proxy
		}

		expect(connectRequests).to.have.lengthOf(1);
		expect(connectRequests[0]).to.equal('api.particle.io:443');
	});
});
