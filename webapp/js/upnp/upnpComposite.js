// Singleton 'Facade'
upnpCompositePattern = (function(){
	var nodes = {};

	return {
		add: function(xml){
			var id = xml.attr('id');
			var parentId = xml.attr('parentID');
			var title = xml.find('title').text();
			var res = xml.find('res').text();
			var classType = xml.find('class').text();

			var node = null;

			if(classType.indexOf("object.container") != -1){
				var childCount = xml.attr('childCount');
				node = new upnpComposite(id, parentId, title, res, classType, childCount);
				// Save the node as a kv pair. Based on (id, node)
				nodes[id] = node;
				return node;
			}else if(classType.indexOf("object.item") != -1){
				console.log("Creating a new leaf...");
				node = new upnpLeaf(id, parentId, title, res, classType);
				// Save the node as a kv pair. Based on (id, node)
				nodes[id] = node;
				return node;
			}else{
				throw ("Error: Unknown classType: " + classType);
			}
		},

		get: function(nodeId){
			return nodes[nodeId];
		}
	};
})();

// Interface...
upnpComponent = function(id, parentId, title, res, classType){
	this.id = id;
	this.parentId = parentId;
	this.title = title;
	this.res = res;
	this.classType = classType;
};

// methods to be implemented in interface.
upnpComponent.prototype = {
	display: function(){
		console.log("Displaying upnpComponent: " + this.title);
	},
	getId: function(){
		return this.id;
	},
	getParentId: function(){
		return this.parentId;
	},
	isRootNode: function(){
		return ((this.parentId === "-1")?true:false);
	},
	getTitle: function(){
		return this.title;
	},
	getRes: function(){
		return this.res;
	},
	toString: function(){
		var mystr = " id: " + this.id + 
		" parentId: " + this.parentId + 
		" title: " + this.title + 
		" res: " + this.res + 
		" classType: " + this.classType;
		return mystr;
	}
};

// Inherits from upnpComponent
upnpLeaf = function(id, parentId, title, res, classType){
	upnpComponent.call(this, id, parentId, title, res, classType);
};
upnpLeaf.prototype = new upnpComponent();

upnpLeaf.prototype.display = function(){
	console.log("Displaying upnpLeaf: " + this.title);
}

// Inherits from upnpComponent
upnpComposite = function(id, parentId, title, res, classType, childCount){
	var children = [];
	this.childCount = childCount;
	upnpComponent.call(this, id, parentId, title, res, classType);
}
upnpComposite.prototype = new upnpComponent();

upnpComposite.prototype.display = function(){
	console.log("Displaying upnpComposite: " + this.title);
};

upnpComposite.prototype.addChild = function(child){
	console.log("Adding child: " + child.title + " to parent: " + this.title);
	children.push(child);
};

upnpComposite.prototype.getChildCount = function(){
//	return this.children.length;
	return this.childCount;
};

