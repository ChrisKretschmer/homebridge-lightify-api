class Plug {
	constructor(config, homebridgeApi, plugin) {
		this.homebridgeApi = homebridgeApi;
		this.name = config.name;
		this.uuid = homebridgeApi.hap.uuid.generate(this.name);
		this.apiURL = plugin.apiURL;
		this.config = config;
		this.plugin = plugin;

		this.currentData = null;
		//this.mac = 
	}

	getServices() {
		let outletService = new this.homebridgeApi.hap.Service.Outlet(this.name);
	    outletService.getCharacteristic(this.homebridgeApi.hap.Characteristic.On)
	                 .on('set', this.setState.bind(this))
	                 .on('get', this.getState.bind(this));

	    let service = new this.homebridgeApi.hap.Service.AccessoryInformation();

	    service.setCharacteristic(this.homebridgeApi.hap.Characteristic.Name, this.name)
	           .setCharacteristic(this.homebridgeApi.hap.Characteristic.Manufacturer, "OSRAM Licht AG")
	           .setCharacteristic(this.homebridgeApi.hap.Characteristic.Model, "Lightify Plug");

	    return [service, outletService];
	}

	setState(value, callback) {
		let me = this;
		//console.log(this.name, arguments)
		let args = {
		    data: {},
		    headers: { 
		    	"Content-Type": "application/json" ,
		    	"authorization": me.plugin.securityToken
		    }
		};
		let url = this.plugin.buildUrl("device/set", {
			time: 0,
			idx: this.config.deviceId,
			onoff: value
		});
		me.plugin.restClient.get(url, args, function (data, response) {
    		if(callback) callback();
		});
	}

	getState(callback) {
		this.getDeviceInfo(function(data) {
			callback(null, data.online && data.on);
		});
	}

	getDeviceInfo(callback) {
		let me = this;
		let args = {
		    data: {
		    },
		    headers: { 
		    	"Content-Type": "application/json" ,
		    	"authorization": me.plugin.securityToken
		    }
		};

		let url = this.plugin.buildUrl("devices/" + this.config.deviceId, {});

		me.plugin.restClient.get(url, args, function (data, response) {
			me.currentData = data;
			callback(data);
		});
	}

}

module.exports = {
	Plug: Plug
}