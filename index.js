var RestClient = require('node-rest-client').Client;
var LightifyPlug = require('./plug.js').Plug;
var LightifyLamp = require('./lamp.js').Lamp;
var debug = require('debug')('LightifyPlugin')

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

	    this.apiURL = this.config.apiURL || "https://eu.lightify-api.org/lightify/services/";

	    this.lastDiscovery = null;
	    this.discoveryResult = [];


		this._refreshInterval = setInterval(this.receiveSecurityToken.bind(this, function() {}), 1000 * 60 * 5);
    }

    receiveSecurityToken(callback) {
    	let me = this;
		let args = {
		    data: { 
		    	username: this.config.username,
		    	password: this.config.password,
		    	serialNumber: this.config.serialNumber
		    },
		    headers: { "Content-Type": "application/json" }
		};
		let url = this.buildUrl("session", {});
		this.restClient.post(url, args, function (data, response) {
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
			let args = {
			    data: {},
			    headers: { 
			    	"Content-Type": "application/json" ,
			    	"authorization": me.securityToken
			    }
			};
			let url = me.buildUrl("devices", {});
			me.restClient.get(url, args, function (data, response) {
			    // parsed response body as js object
			    if(data.errorCode) {
			    	throw data.errorMessage;
			    } else {
			    	data.forEach(function(device) {
			    		if(device.name && device.name != '') {
				    		switch(device.deviceType) {
				    			case 'LIGHT':
				    				if(device.modelName.includes('Plug')) {
				    					accessories.push(new LightifyPlug(device, me.api, me));
				    				} else {
				    					accessories.push(new LightifyLamp(device, me.api, me));
				    				}
				    				
				    				break;
				    			default:
				    				me.log.warn('Unsupported device: ' + device.modelName);

				    		}
				    	} else {
				    		me.log.warn('Ignored unnamed device: ' + device.modelName);
				    	}
			    		
			    	});
			    }

	    		callback(accessories);
			});
		});
    }

	buildUrl(endpoint, parameters) {
		parameters = parameters || {};
		let parameterString = "";
		for (let parameter in parameters) {
			parameterString += parameter + '=' + parameters[parameter] + '&';
		}
		let url = this.apiURL + endpoint + '?' + parameterString;
		debug(url);
		return url;
	}
}