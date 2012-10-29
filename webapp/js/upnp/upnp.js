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
		// TODO: Query the Browser Plug-in or using websockets to get this info.
		// Also, this will happen asynchronously as we find devices.

		//Device Discovery response header - See Upnp-arch-devicearchitecture-v1.0.pdf
		//HTTP/1.1 200 OK 
		//CACHE-CONTROL: max-age = seconds until advertisement expires 
		//DATE: when response was generated 
		//EXT: 
		//LOCATION: URL for UPnP description for root device 
		//SERVER: OS/version UPnP/1.0 product/version 
		//ST: search target 
		//USN: advertisement UUID
		_insertDevice({server:"Synology NAS", location:"http://192.168.0.10:50001/desc/device.xml", validity:"1800", udn:"100"});
		_insertDevice({server:"Ubuntu Laptop", location: "http://192.168.0.22:32469/DeviceDescription.xml", validity: "1800", udn:"200"});
	}

	// As we discover new devices, insert them into the device list.
	function _insertDevice(dev){
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
			console.log("Adding device: " + upnpDev.getServerName() + " " + upnpDev.getUrl());
			deviceList.push(upnpDev);
		}
		// Trigger an event saying device added
		// TODO
	}

	function _getDeviceList(){
		return deviceList;
	}

	return {
	    // Public functions
	    init: function(){
	    	console.log("Initializing upnp...");
   			// Load the scripts pidj depends on.
   			$.getScript("js/upnp/actions.js", function(data, textStatus, jqxhr){
   				console.log("actions.js loaded.");
   			});
   			$.getScript("js/upnp/devices.js", function(data, textStatus, jqxhr){
   				console.log("devices.js loaded.");
   			});
	    },

		// Call this to Discover devices on the network.
		discoverDevices: function(){
			return _discoverDevices();
		},

		// Returns the list of devices found on the network as an array
		getDeviceList: function(){
			console.log("Returning device list...");
			return _getDeviceList();
		},
	}
})();