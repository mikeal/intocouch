var fs = require('fs'),
    sys = require('sys');

function readline (stream, sep, callback) {
  var buffer = '';
  stream.addListener("data", function (chunk) {
    if (chunk.indexOf(sep) != -1) {
      var chunks = chunk.split(sep);
      for (var i=0; i<chunks.length - 1;i+=1) {
        buffer += chunks[i];
        callback(buffer);
        buffer = '';
      }
    }
    buffer += chunk;
  })
  stream.addListener("error", function (error) {
    sys.puts('error: '+error)
  })
  stream.addListener("open", function () {
    sys.puts(sys.inspect(stream))
  })
}

function readlineFile (filename, sep, callback) {
  var stream = fs.createReadStream(filename, {encoding:'binary'});
  readline(stream, sep, callback);
  sys.puts(sys.inspect(stream))  
}

exports.readline = readline;
exports.readlineFile = readlineFile;