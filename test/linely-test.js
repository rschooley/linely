
var should = require('should'),
    linely = require('../linely.js');

describe('Referencing', function () {
    it('should return an object with a LineStream function', function () {
        linely.should.be.an.instanceOf(Object)
        linely.should.have.property('LineStream');
        linely.LineStream.should.be.instanceOf(Function);
    });
});

describe('readFile', function () {
    var lineStream = new linely.LineStream();

    it('should be a function', function () {
        lineStream.should.have.property('readFile');
        lineStream.readFile.should.be.instanceOf(Function);
    });

    it('should require a file path', function (done) {
        lineStream.on('error', function (err) {
            err.message.should.equal('The path is required');
            done();
        });

        lineStream.readFile();
    });
});

describe('read 3 line file without final return', function () {
    var lineStream = new linely.LineStream(),
        path = process.cwd() + '/test/data/three-lines-no-final-return.txt';

    it('should return all 3 lines', function (done) {
        lineStream.on('end', function () {
            lineStream.count.should.equal(3);
            done();
        });

        lineStream.readFile(path);
    });
});
