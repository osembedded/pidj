// UPNP device class
pidj.upnp.device = function(dev){
	this.server = dev.server;
	this.location = dev.location;
	this.validity = dev.validity;
	this.friendlyName = dev.friendlyName;
	this.udn = dev.udn;
};

pidj.upnp.device.prototype = {
	getUrl: function(){
		return this.location;
	},
	setFriendlyName: function(name){
		this.friendlyName = name;
	},
	getFriendlyName: function(){
		return this.friendlyName;
	},
	setUDN: function(devUdn){
		this.udn = devUdn;
	},
	getUDN: function(devUdn){
		return this.udn;
	},
	getServerName: function(){
		return this.server;
	},
	equals: function(dev){
		if(dev.udn == this.udn){
			return true;
		}else{
			return false;
		}
	},
};