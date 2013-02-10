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

function browseThis (upnpId){
	var node = upnpCompositePattern.get(upnpId);
	console.log("Browsing Node: " + node.toString());

	if(node instanceof upnpComposite){
		pidj.upnp.browseChildren(node);
	}else if(node instanceof upnpLeaf){
		console.log("Cannot browse object of type upnpLeaf");
	}else{
		console.log("Unknown instance type.");
	}
}

pidj.upnp.browseChildren = function(node){
	$.ajax({
		url: "http://192.168.0.10:50001/ContentDirectory/control",
		type: "POST",
		success: function (data, textStatus, xhr) {
			console.log("Success doing ajax");
			//console.log(data);
			var result = $(data).find("Result").text();
			var didlXml = $.parseXML(result);
			console.log(didlXml);
			$(didlXml).find("container").each(function(){
				var myNode = upnpCompositePattern.add($(this));
				pidj.upnp.browseMetadata(myNode);
			});
			$(didlXml).find("item").each(function(){
				var myNode = upnpCompositePattern.add($(this));
				pidj.upnp.browseMetadata(myNode);
			});
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log("Error doing ajax");
		},
		headers: {'SOAPACTION': '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
		'content-type': 'text/xml ;charset="utf-8"'},
		data: addSoapWrappers('<ns0:Browse>\
			<ObjectID>' + node.getId() +'</ObjectID>\
			<BrowseFlag>BrowseDirectChildren</BrowseFlag>\
			<Filter>*</Filter>\
			<StartingIndex>0</StartingIndex>\
			<RequestedCount>' + node.getChildCount() + '</RequestedCount>\
			<SortCriteria></SortCriteria>\
			</ns0:Browse>'),
	});
};

pidj.upnp.browseMetadata = function(node){
	var objectId = 0;

	if(null == node){
		// We are browsing the metadata of the root level. i.e. container id 0.
	}else if (typeof node === 'object'){
		objectId = node.getId();
	}else{
		console.log('Invalid parameter passed into browse Metadata.');
	}

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
				var myNode = upnpCompositePattern.add($(this));

				// Add a button so that we can browse the children
				$("#screen").append("<input type='button' " +
					" id='" + myNode.getId() + "' " +
					" value='" + myNode.getTitle() + "' " +
					" onClick=browseThis('" + myNode.getId() + "') >");
			});

			$(didlXml).find("item").each(function(){
				var myNode = upnpCompositePattern.add($(this));

				// Add a button so that we can browse the children
				$("#screen").append("<a href='" + myNode.getRes() + "' >" +
					myNode.getTitle() + "</a>");
			});

		},
		error: function (xhr, textStatus, errorThrown) {
			console.log("Error doing ajax");
		},
		headers: {'SOAPACTION': '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
		'content-type': 'text/xml ;charset="utf-8"'},
		data: addSoapWrappers('<ns0:Browse>\
			<ObjectID>' + objectId + '</ObjectID>\
			<BrowseFlag>BrowseMetadata</BrowseFlag>\
			<Filter>*</Filter>\
			<StartingIndex>0</StartingIndex>\
			<RequestedCount>0</RequestedCount>\
			<SortCriteria></SortCriteria>\
			</ns0:Browse>'),
	});
};
