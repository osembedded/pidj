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
   
var dgram = require('dgram');
var io = require('socket.io');
var request = require('request');
var parseString = require('xml2js').parseString;

var discoverySingleton = (function discovery(){

    ///////////////////////////////////
    // Private variables and methods //
    ///////////////////////////////////
    var discPort = 41235;  // Port to send udp messages
    var notifyPort = 8181; // Default Port for notification
    var sock = null;
    var serverList = [];
    var searchTarget = 0;
    var searchTime = 0;
    //var searchPeriod = 5; // Search every 5 seconds
    var message = new Buffer("");

    // Parses device's usn and location fields.
    function parseDiscoveryResp (msg){
	var line = msg.split('\n');
	var device = {};
	//console.log("msg: " + msg);
 
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

    // Get Server's Friendly Name
    function getServerFriendlyName(url){
	request(url, function(error, response, body){
	    parseString(body, function(err, result){
		console.log(result.root.device[0].friendlyName[0]);
	    });
	});
    }

    function addDevice (device){
	if (false == serverListContains(device)){
	    serverList.push(device);
	    //console.log("Added - " + device.usn + ": " + device.location);
	    return true;
	}
	else{
	    return false;
	}
    }

    function setupDiscovery (srchTarget, srchTime){
	searchTarget = srchTarget;
	searchTime = srchTime;

	/* Setup the message to send for a search */
	message = new Buffer("M-SEARCH * HTTP/1.1\r\n" +
			     "HOST: 239.255.255.250:1900\r\n" +
			     "MAN: \"ssdp:discover\"\r\n" +
			     "ST: " + searchTarget + "\r\n"+
			     "MX: "+ searchTime + "\r\n" +
			     "\r\n");
    }

    function shutDownDiscovery(){
	sock.close();
	sock = null;
    }

    function serverListContains(device){
	var ii;
	for(ii in serverList){
	    if(serverList[ii] == device){
		return true;
	    }
	}
	return false;
    }

   function emitDevice(socket, event, device){
	console.log("Emiting : " + JSON.stringify(device));
	socket.emit(event, device);
    }

    function emitDeviceList(socket){
	if(socket && serverList){
	    for(var ii in serverList){
		emitDevice(socket,
			   'device_added', 
			   serverList[ii]);
	    }
	}
    }

    // Parse Device Info
    function parseDeviceInfo(url, io){
	request(url, function(error, response, body){
	    parseString(body, function(err, result){
		var rootDev = result.root.device[0];
		var dev = {
		    'deviceType': rootDev.deviceType[0],
		    'friendlyName': rootDev.friendlyName[0],
		    'manufacturer': rootDev.manufacturer[0],
		    'modelDescription': rootDev.modelDescription[0],
		    'UDN': rootDev.UDN[0],
		    'location': url,
		};
		
		if(addDevice(dev)){
		    if(io){
			emitDevice(io, 'device_added', dev);
		    }
		}
	    });
	});
    }

    //////////////////////////////////////
    // Privileged variables and methods //
    //////////////////////////////////////
    this.notify = function(notificationPort){
	notifyPort = notificationPort;
	io = io.listen(notifyPort);

	io.sockets.on('connection', function(socket){
	    if(serverList.length){
		//console.log("Emiting on connection");
		emitDeviceList(socket);
	    }
	});
	
	return this;
    }

    this.init = function(){

	/* Create socket necessary for further operation. */
	sock = dgram.createSocket("udp4");

	/* Bind to port */
	sock.bind(discPort);

	/* Setup the handlers for the socket */
	sock.on("message", function(msg, rinfo){
	    var dev = parseDiscoveryResp(msg.toString());

	    if(dev){
		parseDeviceInfo(dev.location, io);
	    }
	});

	sock.on("listening", function(){
	    var address = sock.address();
	    console.log("Server Listening for UDP packets" + 
			address + ":" + address.port);
	});
	
	return this;
    }

    this.start = function(searchTarget, searchTime) {

	console.info("Starting upnp discovery...");

	setupDiscovery(searchTarget, searchTime);

	sock.send(message, 0, message.length, 
		  1900, "239.255.255.250");

	return this;
    }
    
    this.stop = function(){
	console.info("Stopping upnp discovery...");
	shutDownDiscovery();
	return this;
    }

    this.getDevices = function(){
	return serverList;
    }    

    return {
	init: this.init,
	start: this.start,
	stop: this.stop,
	notify: this.notify,
	getDevices: this.getDevices,
    }
})();

// Export the discovery module instance.
module.exports = discoverySingleton;
