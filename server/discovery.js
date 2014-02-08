/* discovery.js - Part of the PiDj project.
   Copyright (C) 2012 Vijay Jayaraman (osembedded@gmail.com)

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// This file implements upnp discovery.

var http = require('http');
var dgram = require('dgram');
var io = require('socket.io').listen(8181);

var discovery = function(){
    var port = 41235;
    var myServers = []; /* The list of 'active' servers found. */
    var sock = null;

    this.retries = 3; /* Since we are dealing with UDP packets, we 
			 need to retry a few times to catch all the responses. */

    /* Private methods. */
    function setupSocket(){
	/* Create socket necessary for further operation. */
	sock = dgram.createSocket("udp4");

	/* Bind to port */
	sock.bind(port);

	/* Setup the handlers for the socket */
	sock.on("message", function(msg, rinfo){
	    /* console.log("Got: " + msg + " from " + rinfo.address + ":" + rinfo.port);  */
	    var dev = _parseDiscoveryResp(msg.toString());

	    if(dev){
		_addDevice(dev);
	    }
	});

	sock.on("listening", function(){
	    var address = sock.address();
	    console.log("Server Listening " + address + ":" + address.port);

	    var blah = {};
	    console.log("adding device test..");
	    blah.usn = "myusn";
	    blah.location = "mylocation";
	    _addDevice(blah);


	});
    };

    function _parseDiscoveryResp (msg){
	var line = msg.split('\n');
	var device = {};
	//var key;
	//var value;
	console.log(msg);

	for(var ii = 0; ii<line.length; ii++){
	    var kvline = line[ii];
	    /* Check to see if the line contains the interesting items. */
	    if(-1 != kvline.search(/LOCATION/i)){
		var startPos = kvline.indexOf(':') + 1;
		if(-1 == startPos){
		    return null;
		}else{
		    device.location = kvline.substring(startPos).replace(/(\r)?( )?/g,'');
		}
	    }else if (-1 != kvline.search(/USN/i)){
		var startPos = kvline.indexOf(':') + 1;
		if(-1 == startPos){
		    return null;
		}else{
		    device.usn = kvline.substring(startPos).replace(/(\r)|( )/g,'');
		}
	    }
	}

	return device;
    }

    function _serverListContains(device)
    {
	var ii;
	for(ii in this.myServers){
	    if(this.myServers[ii] == device){
		return true;
	    }
	}

	return false;
    }

    /* Add a device to our list.*/
    function _addDevice(device){

	if (false == _serverListContains(device))
	{
	    myServers.push(device);
	    console.log("Added - " + device.usn + ": " + device.location);
 	    // Emit a notification..
	    io.sockets.on('connection', function (socket) {
		socket.emit('device_added', device);
	    });
	}
    }

    /* Remove a device from our list. */
    function _removeDevice(){

    }

    /* Accessor functions */
    this.getSock = function(){
	return sock;
    }

    this.getSearchTime = function(){
	return this.searchTime;
    }

    this.setupDiscovery = function(searchTarget, searchTime){
	this.searchTarget = searchTarget;
	this.searchTime = searchTime;

	/* Setup the message to send for a search */
	this.message = new Buffer("M-SEARCH * HTTP/1.1\r\n" +
				  "HOST: 239.255.255.250:1900\r\n" +
				  "MAN: \"ssdp:discover\"\r\n" +
				  "ST: " + this.searchTarget + "\r\n"+
				  "MX: "+ this.searchTime + "\r\n" +
				  "\r\n");

	//console.info("message: " + this.message);
	return setupSocket();
    }

    this.shutDownDiscovery = function(){
	sock.close();
	sock = null;
    }
};

discovery.prototype = {
    /* Start the discovery process. */
    start: function(searchTarget, searchTime){
	/* Wait for the requested time before giving up. */
	var that = this;

	console.info("Starting upnp discovery...");

	// Setup the socket first.
	that.setupDiscovery(searchTarget, searchTime);

	that.getSock().send(that.message, 0, that.message.length, 
			    1900, "239.255.255.250");

	setTimeout(function(){
	    /* Stop the discovery */
	    that.stop();

	    /* Retry getting the devices a few times before we 
	       decide which devices are present in the network. */
	    if(--that.retries != 0){
		that.start(that.searchTarget, that.searchTime);
	    }else{
		console.log("End of discovery phase...");
	    }
	}, that.getSearchTime()*1000);
    },

    /* Pause the discovery process. */
    pause: function(){

    },

    /* Stop the discovery process. */
    stop: function(){
	//console.info("Stopping upnp discovery...");
	this.shutDownDiscovery();
    },

    /* Return a list of devices. */
    getDevices: function(){

    },
}

// Export the discovery module instance.
module.exports = new discovery();

