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
