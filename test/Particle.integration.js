import {expect} from './test-setup';
import Particle from '../src/Particle';
import FixtureHttpServer from './support/FixtureHttpServer';

describe('Particle', () => {
	describe('downloadFile', () => {
		const server = new FixtureHttpServer();
		before(() => server.listen());

		it('download the file', () => {
			const sut = new Particle();
			const filename = 'tarball.tar.gz';
			const fileSize = 24684;
			const url = `${server.url()}/${filename}`;
			return sut.downloadFile({ url })
			.then((contents) => {
				expect(contents.length).to.equal(fileSize);
			});
		});
	});
});
