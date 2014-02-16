/* devices.js - Part of the PiDj project.
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
// UPNP device class
pidj.upnp.device = function(dev){
    console.log("Got Dev: " + dev);
	this.server = dev.server;
	this.location = dev.location;
	this.validity = dev.validity;
	this.friendlyName = dev.friendlyName;
	this.udn = dev.udn;
};

pidj.upnp.device.prototype = {
	getUrl: function(){
		return this.location;
	},
	setFriendlyName: function(name){
		this.friendlyName = name;
	},
	getFriendlyName: function(){
		return this.friendlyName;
	},
	setUDN: function(devUdn){
		this.udn = devUdn;
	},
	getUDN: function(devUdn){
		return this.udn;
	},
	getServerName: function(){
		return this.server;
	},
	equals: function(dev){
		if(dev.udn == this.udn){
			return true;
		}else{
			return false;
		}
	},
};
