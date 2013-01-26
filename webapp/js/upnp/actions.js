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
// Fix this later.
function addSoapWrappers(str){
	var head = '<?xml version="1.0" encoding="utf-8"?>\
	<s:Envelope xmlns:ns0="urn:schemas-upnp-org:service:ContentDirectory:1" \
	s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" \
	xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body>';
	var tail = '</s:Body></s:Envelope>';
	return head + str + tail;
}

pidj.upnp.browseRootChildren = function(){
	$.ajax({
		url: "http://192.168.0.10:50001/ContentDirectory/control",
		type: "POST",
		success: function (data, textStatus, xhr) {
			console.log("Success doing ajax");
			//console.log(data);
			var result = $(data).find("Result").text();
			//console.log(result);
			var didlXml = $.parseXML(result);
			console.log(didlXml);
			$(didlXml).find("container").each(function(){
				var obj = new upnpObject($(this));
				if(obj instanceof upnpObject.container){
					console.log("Created a new UPNP object of type: upnp container.");
				}else if(obj instanceof upnpObject.item){
					console.log("Created a new UPNP object of type: upnp item.");
				}else{
					console.log("Unknown upnp object type returned!!!!");
				}

				console.log(obj);
			});
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log("Error doing ajax");
		},
		headers: {'SOAPACTION': '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
		'content-type': 'text/xml ;charset="utf-8"'},
		data: addSoapWrappers('<ns0:Browse>\
			<ObjectID>0</ObjectID>\
			<BrowseFlag>BrowseDirectChildren</BrowseFlag>\
			<Filter>*</Filter>\
			<StartingIndex>0</StartingIndex>\
			<RequestedCount>3</RequestedCount>\
			<SortCriteria></SortCriteria>\
			</ns0:Browse>'),
	});
};

pidj.upnp.browseRootLevel = function(){
	$.ajax({
		url: "http://192.168.0.10:50001/ContentDirectory/control",
		type: "POST",
		success: function (data, textStatus, xhr) {
			console.log("Success doing ajax");
			//console.log(data);
			var result = $(data).find("Result").text();
			//console.log(result);
			var didlXml = $.parseXML(result);
			console.log(didlXml);
			$(didlXml).find("container").each(function(){
				var obj = new upnpObject($(this));
				if(obj instanceof upnpObject.container){
					console.log("Created a new UPNP object of type: upnp container.");
				}else if(obj instanceof upnpObject.item){
					console.log("Created a new UPNP object of type: upnp item.");
				}else{
					console.log("Unknown upnp object type returned!!!!");
				}

				console.log(obj);
				// hack - do this cleanly.
				pidj.upnp.browseRootChildren();
			});
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log("Error doing ajax");
		},
		headers: {'SOAPACTION': '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
		'content-type': 'text/xml ;charset="utf-8"'},
		data: addSoapWrappers('<ns0:Browse>\
			<ObjectID>0</ObjectID>\
			<BrowseFlag>BrowseMetadata</BrowseFlag>\
			<Filter>*</Filter>\
			<StartingIndex>0</StartingIndex>\
			<RequestedCount>0</RequestedCount>\
			<SortCriteria></SortCriteria>\
			</ns0:Browse>'),
	});
};
