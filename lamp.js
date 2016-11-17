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

	    return [service, lightService];
	}

}

module.exports = {
	Lamp: Lamp
}