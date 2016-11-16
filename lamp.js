var Plug = require('./plug.js').Plug;

class Lamp extends Plug {
	constructor(config, homebridgeApi, plugin) {
		super(config, homebridgeApi, plugin)
	}

	getServices() {
		let serviceArray = super();
		console.log(serviceArray);
		return serviceArray;
	}

}

module.exports = {
	Lamp: Lamp
}