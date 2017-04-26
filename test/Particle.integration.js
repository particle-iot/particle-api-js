import {expect, sinon} from './test-setup';
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

	describe('context', () => {
		it('adds headers for the context', () => {
			const sut = new Particle();
			sut.setContext('tool', {name:'cli', version:'1.2.3'});
			sut.setContext('project', {name:'blinky', version:'0.0.1'});
			sut.agent._promiseResponse = sinon.stub().returns(Promise.resolve());
			return sut.flashTinker('deviceID', 'auth').then(() => {
				expect(sut.agent._promiseResponse).to.have.been.calledOnce;
				const req = sut.agent._promiseResponse.firstCall.args[0];
				expect(req).to.be.ok;
				expect(req.header).to.have.property('X-Particle-Tool').eql('cli@1.2.3');
				expect(req.header).to.have.property('X-Particle-Project').eql('blinky; version=0.0.1');
			});
		});
	});
});
