var http = require('http');
var dgram = require('dgram');

var timeDelay = 5;
var retries = 3; /* Since we are dealing with UDP packets, 
	we need to retry to make sure we did not miss any. */
var myServers = {};

var mySock = dgram.createSocket("udp4");
var message = new Buffer("M-SEARCH * HTTP/1.1\r\n" +
	"HOST: 239.255.255.250:1900\r\n" +
	"MAN: \"ssdp:discover\"\r\n" +
	//	"ST: upnp:rootdevice\r\n" +
	//	"ST: ssdp:all\r\n" +
	//	"ST: urn:schemas-upnp-org:device:MediaServer\r\n" +
	"ST: urn:schemas-upnp-org:service:ContentDirectory\r\n" +
	"MX: "+ timeDelay + "\r\n" +
	"\r\n");

function parseDiscoveryResp (msg){
	var line = msg.split('\n');
	var key;
	var value;

	for(var ii = 0; ii<line.length; ii++){
		var kvline = line[ii];
		/* Check to see if the line contains the interesting items. */
		if(-1 != kvline.search(/LOCATION/i)){
			var startPos = kvline.indexOf(':') + 1;
			if(-1 == startPos){
				return null;
			}else{
				value = kvline.substring(startPos).replace(/(\r)?( )?/g,'');
			}
		}else if (-1 != kvline.search(/USN/i)){
			var startPos = kvline.indexOf(':') + 1;
			if(-1 == startPos){
				return null;
			}else{
				key = kvline.substring(startPos).replace(/(\r)|( )/g,'');
			}
		}
	}

	if(key && value){
		var result = {};
		result.key = key;
		result.value = value;
		return result;
	}
}

mySock.on("message", function(msg, rinfo){
	//	console.log("Got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
	var srv = parseDiscoveryResp(msg.toString());
	if(!(srv.key in myServers)){
		myServers[srv.key] = srv.value;
		console.log("Added - " + srv.key + ": " + srv.value);
	}
});

mySock.on("listening", function(){
	var address = mySock.address();
	console.log("Server Listening " + address + ":" + address.port);
});

mySock.bind(41234);

mySock.send(message, 0, message.length, 1900, "239.255.255.250");

setTimeout(function(){
	console.log("Closing socket...");
	mySock.close();
}, timeDelay*1000);

/*http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');*/