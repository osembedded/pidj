/* upnp.js - Part of the PiDj project.
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

pidj.upnp = (function(){
    var deviceList = [];

    // Returns true on Success, false otherwise.
    function _discoverDevices(){
    }

    // As we discover new devices, insert them into the device list.
    function _insertDevice(dev){
	console.log("Inserting device...");
	var inList = false;
	// Create a new upnp device instance.
	var upnpDev = new pidj.upnp.device(dev);

	// Check to see if the device already exists.
	for (var iter in deviceList){
	    if(deviceList[iter].equals(upnpDev)){
		inList = true;
	    }
	}

	if(!inList){
	    console.log("Adding device: " + upnpDev.getFriendlyName() + 
			" " + upnpDev.getUrl());
	    deviceList.push(upnpDev);
	}
    }

    function _getDeviceList(){
	return deviceList;
    }

    return {
	// Public functions
	init: function(){
	    console.log("Initializing upnp...");

	    var socket = io.connect("http://localhost:8181");
	    socket.on('device_added', function(data){
		console.log("Got device_added message...");
		_insertDevice(data);
	    });

   	    // Load the scripts pidj depends on.
   	    $.getScript("js/upnp/upnpComposite.js")
   		.done(function(data, textStatus, jqxhr){
   		    console.log("upnpComposite.js loaded.");
   		});

   	    $.getScript("js/upnp/actions.js", function(data, textStatus, jqxhr){
   		console.log("actions.js loaded.");
   	    });

   	    $.getScript("js/upnp/devices.js", function(data, textStatus, jqxhr){
   		console.log("devices.js loaded.");
   	    });

	    // Use Socket.io to receive notification from the server.
	    var socket = io.connect('http://localhost:8181');

	    socket.on('device_added', function (data) {
	        console.log(data);
	    });

	},

	// Call this to Discover devices on the network.
	discoverDevices: function(){
	    // TODO: Start the discovery process.

	    return _discoverDevices();
	},

	// Returns the list of devices found on the network as an array
	getDeviceList: function(){
	    console.log("Returning device list...");
	    return _getDeviceList();
	},
    }
})();

