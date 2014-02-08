var http = require('http');
var url = require('url');
var nodeStatic = require('node-static');
var discovery = require('./discovery.js');

// Start the discovery process for any content directory service out there.
//discovery.start("ST: ssdp:all", 5);
//discovery.start("ST: upnp:rootdevice", 5);
//discovery.start("ST: urn:schemas-upnp-org:device:MediaServer", 5);
discovery.start("ST: urn:schemas-upnp-org:service:ContentDirectory", 5);

var fileServer = new nodeStatic.Server('.', { headers : {'Access-Control-Allow-Origin':'*'}});

var server = http.createServer(function (req, res) {

    //console.log("Requested url: "  + req.url);

    if(req.url.search("webapp") != -1){
	// Serve static files
	fileServer.serve(req, res);
    }
    else if(req.url.search("proxy") != -1){
	// Send the request to the client and fix the access control headers.
	var params = url.parse(req.url, true);
	var proxyUrl = "http://" + params.query.proxy;
	var destParams = url.parse(proxyUrl);

	var proxyReqOptions = {
	    host : destParams.hostname,
	    port : destParams.port,
	    path : destParams.pathname,
	    method : req.method,
	    //headers: req.headers
	    headers: {
		soapaction: req.headers['soapaction'],
		'content-type' : req.headers['content-type'],
	    }
	};	    

	var proxyReq = http.request(proxyReqOptions, function(proxyRes) {
	    var headers = proxyRes.headers;
	    headers['Access-Control-Allow-Origin'] = '*';
	    headers['Access-Control-Allow-Headers'] = 'X-Requested-With';
	    res.writeHead(200, headers);

	    proxyRes.on('data', function(chunk) {
		res.write(chunk);
	    });

	    proxyRes.on('end', function() {
		res.end();
		proxyReq.end();
	    });
	});

	proxyReq.on('error', function(e) {
	    console.log('An error occured (while proxying): ' + e.message);
	    console.dir(e);
	    res.writeHead(503);
	    res.write("Error!");
	    res.end();
	    proxyReq.end();
	});
	
	req.on('data', function(chunk) {
	    proxyReq.write(chunk.toString());
	});
	
	req.on('end', function(){
	    proxyReq.end();
	});
    }
    else{
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Request not supported.\n');	 
    }

});

server.listen(8080, '127.0.0.1');

console.log('PiDj Server running at http://127.0.0.1:8080/');