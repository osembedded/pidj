/* actions.js - Part of the PiDj project.
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
pidj.upnp.fakeBrowse = function(){
	$.ajax({
		url: "http://192.168.0.10:50001/ContentDirectory/control",
		type: "POST",
		success: function (data, textStatus, xhr) {
			console.log("Success doing ajax");
			console.log(data);
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log("Error doing ajax");
		},
		headers: {'SOAPACTION': '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
		'content-type': 'text/xml ;charset="utf-8"'},
		data: '<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:ns0="urn:schemas-upnp-org:service:ContentDirectory:1" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body><ns0:Browse><ObjectID>0</ObjectID><BrowseFlag>BrowseDirectChildren</BrowseFlag><Filter>id,dc:title,upnp:class,res,res@duration</Filter><StartingIndex>0</StartingIndex><RequestedCount>10</RequestedCount><SortCriteria>+dc:title</SortCriteria></ns0:Browse></s:Body></s:Envelope>',
	});
};
