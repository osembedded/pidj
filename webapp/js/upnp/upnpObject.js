function upnpObject (ctxt) {
	var classStr = ctxt.find('class').text();
	if(classStr.indexOf("object.container") != -1){
		return new upnpObject.container(ctxt);
	}else if(classStr.indexOf("object.item") != -1){
		return new upnpObject.item(ctxt);
	}else{
		throw ("Error: Unknown classStr: " + classStr);
	}
}

function addDbg(key, val){
	return "<div id='dbgElem'>" + key +": "+ val + "</div>";
}

upnpObject.base = function(ctxt){
//	var creator;
//	var res;
//	var _class;
//	var restricted;
//	var writeStatus;

	this.id = ctxt.attr('id'); // Note id doesn't have to be a number.
	this.parentID = ctxt.attr('parentID');
	this.title = ctxt.find('title').text();
}

upnpObject.base.prototype.toString = function(){
		var myStr = "";
		myStr += addDbg("id", this.id);
		myStr += addDbg("parentID", this.parentID);
		myStr += addDbg("title", this.title);
		return myStr;
}

upnpObject.container = function(ctxt){
	this.base = new upnpObject.base(ctxt);
	this.rootNode = (this.base.parentID == "-1")?true:false;
	this.childCount = ctxt.attr('childCount');

//	this.createClass;
//	this.searchClass;
//	this.searchable;
}

upnpObject.container.prototype.toString = function(){
	var myStr = "";
	myStr += addDbg("rootNode", this.rootNode);
	myStr += addDbg("childCount", this.childCount);
	myStr += this.base.toString();
	return myStr;
}

upnpObject.item = function(ctxt){
	this.base = new upnpObject.base(ctxt);

//	var refId;
}

upnpObject.item.prototype.toString = function(){
	var myStr = "";
	myStr += this.base.toString();
	return myStr;
}




