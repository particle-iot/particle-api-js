import {expect} from './test-setup';
import Particle from '../src/Particle';

describe('Particle', () => {
	describe('downloadFile', () => {
		it('download the file', () => {
			const sut = new Particle();
			const url = 'https://s3.amazonaws.com/binaries.particle.io/libraries/neopixel/neopixel-0.0.10.tar.gz';
			const fileSize = 25505;
			return sut.downloadFile({ url })
			.then(contents => {
				expect(contents.length || contents.byteLength).to.equal(fileSize);
			});
		});
	});
});
