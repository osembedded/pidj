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

function ElemTree(){
	var childList = new Array();
	this.add = function(entry){
		childList.push(entry);

		browseThis = function(myIdx){
			var myObj = childList[myIdx];
			console.log("Browsing : " + myObj.base.title);
			pidj.upnp.browseMetadata(myObj);
		};

		var idx = childList.length - 1;
		console.log("current idx: " + idx);

		$("#screen").append("<input type='button' " +
			" id='" + idx + "' " +
			" value='" + childList[idx].base.title + "' " +
			" onClick='browseThis(" + idx + ")' >");
		$("#" + idx).hover(function(){
			console.log("Hovering on idx: " + idx );
			console.log("String: " + childList[idx].toString());
		});
	};
};

var myTree = new ElemTree();

pidj.upnp.browseChildren = function(parent, childCount){
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
				myTree.add(obj);
			});
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log("Error doing ajax");
		},
		headers: {'SOAPACTION': '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"',
		'content-type': 'text/xml ;charset="utf-8"'},
		data: addSoapWrappers('<ns0:Browse>\
			<ObjectID>' + parent.base.id +'</ObjectID>\
			<BrowseFlag>BrowseDirectChildren</BrowseFlag>\
			<Filter>*</Filter>\
			<StartingIndex>0</StartingIndex>\
			<RequestedCount>' + childCount + '</RequestedCount>\
			<SortCriteria></SortCriteria>\
			</ns0:Browse>'),
	});
};

pidj.upnp.browseMetadata = function(parentContainer){
	var objectId = 0;

	if(null == parentContainer){
		// We are browsing the metadata of the root level. i.e. container id 0.
	}else if (typeof parentContainer === 'object'){
		objectId = parentContainer.base.id;
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
				var obj = new upnpObject($(this));
				if(obj instanceof upnpObject.container){
					console.log("Created a new UPNP object of type: upnp container.");
				}else if(obj instanceof upnpObject.item){
					console.log("Created a new UPNP object of type: upnp item.");
				}else{
					console.log("Unknown upnp object type returned!!!!");
				}

				console.log(obj);
				myTree.add(obj);

				pidj.upnp.browseChildren(obj, obj.childCount);
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
