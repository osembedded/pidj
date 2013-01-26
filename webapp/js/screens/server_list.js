/* server_list.js - Part of the PiDj project.
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

// This page will list all the DMSs on the network.

$('#screen').remove();
$("#surface").append("<div id='screen'></div>");
$("<span style='color:white;font-size:large'>Server List Screen</span>").appendTo("#screen");

// Once the user selects the server, we navigate to the page with all the media discovered.

var nextScreen = function(serverName){

	// Load the script for the server list page.
	$.getScript("js/screens/media_main.js", function(data, textStatus, jqxhr){
		console.log("loading the Main Media JS");
	});
};

// Display the list of servers found...
$("#screen").append("<ol id='selectable'><ol>");

// Kick off the discovery process.
// TODO: Figure out an optimal location to kick this.
pidj.upnp.discoverDevices();
var servers = pidj.upnp.getDeviceList("DMS");
for(var ii = 0; ii < servers.length; ii++){
	//console.log("Server " + ii + ": " + servers[ii].getServerName() + " - " + servers[ii].getUrl("root"));
	$("#selectable").append("<li class='ui-widget-content'>" + servers[ii].getServerName() + "</li>");
}

$( "#selectable" ).selectable({
    stop: function() {
        $( ".ui-selected", this ).each(function() {
            var index = $( "#selectable li" ).index( this );
            pidj.core.setSelectedServer(servers[index].getServerName());
            pidj.upnp.browseRootLevel();
            nextScreen();
        });
    }
});

/*$(function() {
        $( "#selectable" ).selectable();
    });*/
console.log("Server List js loaded...");