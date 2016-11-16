var RestClient = require('node-rest-client').Client;
var LightifyPlug = require('./plug.js').Plug;
var LightifyLamp = require('./plug.js').Lamp;

var Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
    Accessory      = homebridge.platformAccessory;
    Service        = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen        = homebridge.hap.uuid;
    homebridge.registerPlatform("homebridge-lightify-api", "Lightify API", LightifyPlatform);
};

class LightifyPlatform {

    constructor(log, config, api) {
	    this.log = log;
	    this.config = config;
	    this.api = api;
	    this.restClient = new RestClient();
	    this.securityToken = null;

	    this.apiURL = "https://eu.lightify-api.org/lightify/services/";

	    this.lastDiscovery = null;
	    this.discoveryResult = [];


		this._refreshInterval = setInterval(this.receiveSecurityToken.bind(this, function() {}), 1000 * 60 * 5);
    }

    receiveSecurityToken(callback) {
    	console.log("renewing security token");
    	let me = this;
		let args = {
		    data: { 
		    	username: this.config.username,
		    	password: this.config.password,
		    	serialNumber: this.config.serialNumber
		    },
		    headers: { "Content-Type": "application/json" }
		};

		this.restClient.post(this.apiURL + "session", args, function (data, response) {
		    // parsed response body as js object
		    if(data.errorCode) {
		    	throw data.errorMessage;
		    } else {
		    	me.securityToken = data.securityToken;
		    	callback(me.securityToken);
		    }
		});
    }

    accessories(callback) {
    	let me = this;
    	let accessories = [];
    	this.receiveSecurityToken(function(token) {
			var args = {
			    data: {},
			    headers: { 
			    	"Content-Type": "application/json" ,
			    	"authorization": me.securityToken
			    }
			};
			me.restClient.get(me.apiURL + "devices", args, function (data, response) {
			    // parsed response body as js object
			    if(data.errorCode) {
			    	throw data.errorMessage;
			    } else {
			    	data.forEach(function(device) {
			    		switch(device.modelName) {
			    			case 'Plug 01':
			    				accessories.push(new LightifyPlug(device, me.api, me));
			    				break;
			    			// case 'Flex RGBW':
			    			// case 'Classic A60 TW':
			    			// 	accessories.push(new LightifyLamp(device, me.api, me));
			    			// 	break;
			    			default:
			    				me.log.warn('Unknown device: ' + device.modelName);

			    		}
			    		
			    	});
			    }

	    		callback(accessories);
			});
		});
    }


}