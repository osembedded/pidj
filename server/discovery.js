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

/* This file implements upnp discovery and notification.
   The first time a client connects, a list of servers will be 
   broadcast. After that, only updates will be broadcast. */
   
var http = require('http');
var dgram = require('dgram');
var io = require('socket.io');

function discovery(){

    ///////////////////////////////////
    // Private variables and methods //
    ///////////////////////////////////
    var discPort = 41235;
    var notifyPort = 8181; // Default
    this.sock = null;

    // Parses device's usn and location fields.
    function parseDiscoveryResp (msg){
	var line = msg.split('\n');
	var device = {};
	//console.log(msg);
 
	for(var ii = 0; ii<line.length; ii++){
	    var kvline = line[ii];

	    if(-1 != kvline.search(/LOCATION/i)){
		var startPos = kvline.indexOf(':') + 1;
		if(-1 == startPos){
		    return null;
		}else{
		    device.location = 
			kvline.substring(startPos).replace(/(\r)?( )?/g,'');
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

    //////////////////////////////////////
    // Privileged variables and methods //
    //////////////////////////////////////
    this.myServers = [];
    this.searchTarget = 0;
    this.searchTime = 0;
    this.message = new Buffer("");

    this.getSock = function(){
	return this.sock;
    }

    this.getSearchTime = function(){
	return this.searchTime;
    }

    this.init = function(notificationPort){
	var that = this;

	/* Set Notification port */
	console.log("Setting Notification port to " + notificationPort);
	notifyPort = notificationPort;

	io = io.listen(notifyPort);

	/* Create socket necessary for further operation. */
	that.sock = dgram.createSocket("udp4");

	/* Bind to port */
	that.sock.bind(discPort);

	/* Setup the handlers for the socket */
	that.sock.on("message", function(msg, rinfo){
	    var dev = parseDiscoveryResp(msg.toString());

	    if(dev){
		if(that.addDevice(dev)){
		    //console.log("Added new device...");
		   // io.emit('news', { hello: 'world' });
		}
	    }
	});

	that.sock.on("listening", function(){
	    var address = that.getSock().address();
	    console.log("Server Listening for UDP packets" + 
			address + ":" + address.port);
	});
    }

    this.setupDiscovery = function (searchTarget, searchTime){
	var that = this;

	that.searchTarget = searchTarget;
	that.searchTime = searchTime;

	/* Setup the message to send for a search */
	that.message = new Buffer("M-SEARCH * HTTP/1.1\r\n" +
				  "HOST: 239.255.255.250:1900\r\n" +
				  "MAN: \"ssdp:discover\"\r\n" +
				  "ST: " + that.searchTarget + "\r\n"+
				  "MX: "+ that.searchTime + "\r\n" +
				  "\r\n");
    }

    this.shutDownDiscovery = function(){
	this.sock.close();
	this.sock = null;
    }

    this.start = function(searchTarget, searchTime) {
	/* Wait for the requested time before giving up. */
	var that = this;

	console.info("Starting upnp discovery...");

	// Setup the socket first.
	that.setupDiscovery(searchTarget, searchTime);

	//console.log("that.message: " + that.message);

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
		console.log("End of discovery. ");
	    }
	}, that.getSearchTime()*1000);
    }
    
    this.stop = function(){
	console.info("Stopping upnp discovery...");
	this.shutDownDiscovery();
    }

    this.serverListContains = function (device)
    {
	var ii;
	for(ii in this.myServers){
	    if(this.myServers[ii] == device){
		return true;
	    }
	}
	return false;
    }

    this.addDevice = function(device){
	if (false == this.serverListContains(device)){
	    this.myServers.push(device);
	    console.log("Added - " + device.usn + ": " + device.location);
	    return true;
	}
	else{
	    return false;
	}
    }

    this.removeDevice = function(device){
	//TODO
    }

    this.getDevices = function(){
	console.log("getDevices called...");
	return this.myServers;
    }    
}

// Export the discovery module instance.
var discInst = new discovery();
module.exports = discInst;
