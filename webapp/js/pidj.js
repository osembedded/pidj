/* pidj.js - Part of the PiDj project.
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
var pidj = {};

pidj.core = (function(){
	// Private members.
	var version = 0.1;
	var DMSList = new Array();
	DMSList[0] = {name:"RedCurry",ip:"192.168.0.10"};
	DMSList[1] = {name:"Peace",ip:"192.168.0.22"};

	// Private methods.
	function _discoverDMSs(){
		// Discover content servers on the network.
		return true;
	}

	return {
	// Public members

	// Public functions
	init: function(){
		console.log("Initializing pidj...");
		return _discoverDMSs();
	},

	getVersion: function(){
		return version;
	},

	getDMSList: function(){
		return DMSList;
	},

	}
})();


$(document).ready(function(){
	pidj.core.init();

	var servers = pidj.core.getDMSList();
	for(var ii = 0; ii < servers.length; ii++){
		console.log("Server " + ii + ": " + servers[ii].name + " - " + servers[ii].ip);
	}

	// Load the script for the Startup Page.
	$.getScript("js/screens/startup.js", function(data, textStatus, jqxhr){
		// Generate the QR code for the control url...
		$("#connectQr").qrcode({
			bgColor:'#fff',
			width: 256,
			height: 256,
			text:'Hi from PiDj!'});
	});
});
	
