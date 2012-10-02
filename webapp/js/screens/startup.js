/* startup.js - Part of the PiDj project.
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
$('#screen').remove();
$("#surface").append("<div id='screen'></div>");
$("<span style='color:white;font-size:large'>Test QR Code... </span>").appendTo("#screen");
$("<div id='connectQr'></div>").appendTo("#screen");

// Once the smartphone app connects to the rpi using the QR Code, this page will auto navigate to the server list page.
// until then, use an onscreen button to proceed to the next screen.

var nextScreen = function(){
	// Load the script for the server list page.
	$.getScript("js/screens/server_list.js", function(data, textStatus, jqxhr){
		console.log("loading the server_list.js");
	});
};

$("#screen").append("<button onClick='nextScreen()'>next</button>");

console.log("startup.js loaded");