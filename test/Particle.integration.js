const { expect, sinon } = require('./test-setup');
const Particle = require('../src/Particle');

describe('Particle', () => {
    let api;

    beforeEach(() => {
        api = new Particle({ baseUrl: '' });
    });

    describe('downloadFile', () => {
        it('download the file', () => {
            const uri = 'https://binaries.particle.io/libraries/neopixel/neopixel-0.0.10.tar.gz';
            const fileSize = 25505;
            return api.downloadFile({ uri })
                .then(contents => {
                    expect(contents.length || contents.byteLength).to.equal(fileSize);
                });
        });
    });

    describe('context', () => {
        it('adds headers for the context', () => {
            api.setContext('tool', { name:'cli', version:'1.2.3' });
            api.setContext('project', { name:'blinky', version:'0.0.1' });
            api.agent._promiseResponse = sinon.stub().resolves();
            return api.flashTinker('deviceID', 'auth').then(() => {
                expect(api.agent._promiseResponse).to.have.been.calledOnce;
                const req = api.agent._promiseResponse.firstCall.args[0];
                const options = req[1];
                expect(req).to.be.ok;
                expect(options.headers).to.have.property('X-Particle-Tool').eql('cli@1.2.3');
                expect(options.headers).to.have.property('X-Particle-Project').eql('blinky; version=0.0.1');
            });
        });
    });
});
