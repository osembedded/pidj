var http = require('http');
var discovery = require('./discovery.js');

// Start the discovery process for any content directory service out there.
//discovery.start("ST: ssdp:all", 5);
//discovery.start("ST: upnp:rootdevice", 5);
//discovery.start("ST: urn:schemas-upnp-org:device:MediaServer", 5);
discovery.start("ST: urn:schemas-upnp-org:service:ContentDirectory", 5);

// TODO: Serve the static content for pidj.

/*http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');*/