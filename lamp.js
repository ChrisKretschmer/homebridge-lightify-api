var Plug = require('./plug.js').Plug;

class Lamp extends Plug {

	constructor(config, homebridgeApi, plugin) {
		super(config, homebridgeApi, plugin);
	}

	getServices() {
	    var service = new this.homebridgeApi.hap.Service.AccessoryInformation();
	    service.setCharacteristic(this.homebridgeApi.hap.Characteristic.Name, this.name)
	           .setCharacteristic(this.homebridgeApi.hap.Characteristic.Manufacturer, "OSRAM Licht AG")
	           .setCharacteristic(this.homebridgeApi.hap.Characteristic.Model, "Lightify Lamp");

	    var lightService = new this.homebridgeApi.hap.Service.Lightbulb(this.name);

	    lightService.getCharacteristic(this.homebridgeApi.hap.Characteristic.On)
	                .on('set', this.setState.bind(this))
	                .on('get', this.getState.bind(this));

	    if(this.config.bmpClusters.indexOf('Temperature') >= 0 && this.config.bmpClusters.indexOf('Color') < 0) {
		    lightService.getCharacteristic(this.homebridgeApi.hap.Characteristic.Saturation)
                    .on('set', this.setK.bind(this))
                    .on('get', this.getK.bind(this));
	    }

	    if (this.config.bmpClusters.indexOf('Level') >= 0) {
	        lightService.getCharacteristic(this.homebridgeApi.hap.Characteristic.Brightness)
	                .on('set', this.setBrightness.bind(this))
	                .on('get', this.getBrightness.bind(this));
	    }

	    if (this.config.bmpClusters.indexOf('Color') >= 0) {
	        lightService.getCharacteristic(this.homebridgeApi.hap.Characteristic.Hue)
	                .on('set', this.setHue.bind(this))
	                .on('get', this.getHue.bind(this));

		    lightService.getCharacteristic(this.homebridgeApi.hap.Characteristic.Saturation)
                    .on('set', this.setSaturation.bind(this))
                    .on('get', this.getSaturation.bind(this));
	    }

	    return [service, lightService];
	}

	setSaturation(value, callback) {
		let me = this;
		this.saturation = value;
		if(callback) callback();
	}

	getSaturation(callback) {
		this.getDeviceInfo(function(data) {
			callback(null, data.saturation * 100);
		});
	}

	setBrightness(value, callback) {
		let me = this;
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
			level: (value / 100)
		});
		me.plugin.restClient.get(url, args, function (data, response) {
    		if(callback) callback();
		});
	}

	getBrightness(callback) {
		this.getDeviceInfo(function(data) {
			callback(null, data.brightnessLevel * 100);
		});
	}

	setHue(value, callback) {
		let me = this;
		let args = {
		    data: {},
		    headers: { 
		    	"Content-Type": "application/json" ,
		    	"authorization": me.plugin.securityToken
		    }
		};
		value = Math.max(1,value);
		value = Math.min(359,value);
		let url = this.plugin.buildUrl("device/set", {
			time: 0,
			idx: this.config.deviceId,
			hue: value,
			saturation: this.saturation / 100 || 1
		});
		me.plugin.restClient.get(url, args, function (data, response) {
    		if(callback) callback();
		});
	}

	getHue(callback) {
		this.getDeviceInfo(function(data) {
			callback(null, data.hue);
		});
	}

	setK(value, callback) {

		value = this.remapValue(0, 100, 2700, 6500, value);

		let me = this;
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
			ctemp: value
		});
		me.plugin.restClient.get(url, args, function (data, response) {
    		if(callback) callback();
		});
	}

	getK(callback) {
		let me = this;
		this.getDeviceInfo(function(data) {
			let value = me.remapValue(2700, 6500, 0, 100, data.temperature);
			callback(null, value);
		});
	}

	remapValue(inputStart, inputEnd, outputStart, outputEnd, value) {
		return (value - inputStart) * (outputEnd - outputStart) / (inputEnd - inputStart) + outputStart;
	}

}

module.exports = {
	Lamp: Lamp
}