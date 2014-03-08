
//
// dependencies
//

var fs      = require('fs'),
    Stream  = require('stream'),
    util    = require('util');

//
// constructor
//

function LineStream () {
    this.count  = 0;
    this.stream = null;
};

util.inherits(LineStream, Stream);

//
// methods
//

LineStream.prototype.readFile = function (path, options) {
    var self    = this,
        buffer  = '';

    if (!path) {
        return self.emit('error', new Error('The path is required'));
    }

    this.count = 0;
    this.stream = fs.createReadStream(path, options);

    this.stream.on('data', function (data) {
        // note: adding \r for legacy MacOS breaks the regex
        //  chunk boundary where \r exists and next chunk has \n
        var pattern     = /\r\n|\n/gm,
            matches     = [],
            line        = '',
            startIndex  = 0,
            stopIndex   = 0;

        // take care of any line fragments
        buffer += data;

        // the regex and substring is the fastest way I could find so far
        // todo: a lot of assumptions on string, and not using encoding
        while ((matches = pattern.exec(buffer)) !== null) {
            stopIndex   = matches.index;
            line        = buffer.substring(startIndex, stopIndex);
            startIndex  = pattern.lastIndex;

            self.count = self.count + 1;
            self.emit('line', line, self.count);
        }

        buffer = buffer.substring(startIndex);
    });

    this.stream.on('end', function () {
        // make sure we don't miss the last line if it's in the buffer
        if (buffer.length > 0) {
            self.count = self.count + 1;
            self.emit('line', buffer, self.count);
        }

        self.emit('end');
    });

    this.stream.on('error', function (err) {
        self.emit('error', err);
    });
};

//
// exports
//

exports.LineStream = LineStream;
