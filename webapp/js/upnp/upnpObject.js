function upnpObject (ctxt) {
	var classStr = ctxt.find('class').text();
	if(classStr.indexOf("object.container") != -1){
		return new upnpObject.container(ctxt);
	}else if(classStr.indexOf("object.item") != -1){
		return new upnpObject.item(ctxt);
	}else{
		throw ("Error: Unknown classStr: " + classStr);
	}
};

upnpObject.base = function(ctxt){
//	var creator;
//	var res;
//	var _class;
//	var restricted;
//	var writeStatus;

	this.id = +(ctxt.attr('id'));
	this.parentID = ctxt.attr('parentID');
	this.title = ctxt.find('title').text();
};

upnpObject.container = function(ctxt){
	this.base = new upnpObject.base(ctxt);
	this.rootNode = (this.base.id === 0)?true:false;
	this.childCount = ctxt.attr('childCount');
//	this.createClass;
//	this.searchClass;
//	this.searchable;
};

upnpObject.item = function(ctxt){
	this.base = new upnpObject.base(ctxt);
//	var refId;
};

