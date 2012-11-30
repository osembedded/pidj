function upnpObject (classStr) {
	if(classStr.indexOf("object.container") != -1){
		this.type = upnpObject.types.container;
		return new upnpObject.container();
	}else if(classStr.indexOf("object.item") != -1){
		this.type = upnpObject.types.item;
		return new upnpObject.item();
	}else{
		this.type = upnpObject.types.invalid;
		throw ("Error: Unknown classStr: " + classStr);
	}
};

upnpObject.types = {
	invalid: -1,
	obj: 0,
	container: 1,
	item: 2,
};

upnpObject.prototype.getTypeStr = function(){
	switch(this.type){
		case types.obj: return "Object";
		case types.container: return "Container";
		case types.item: return "Item";
		default: return "Unknown";
	}
}

upnpObject.base = function(){
	var id;
	var parentID;
	var title;
	var creator;
	var res;
	var _class;
	var restricted;
	var writeStatus;
};

upnpObject.container = function(){
	var base = new upnpObject.base();
	var childCount;
	var createClass;
	var searchClass;
	var searchable;
};

upnpObject.item = function(){
	var base = new upnpObject.base();
	var refId;
};

