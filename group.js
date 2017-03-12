var Plug = require('./plug.js').Plug;
var _ = require('underscore');

class Group extends Plug {
    constructor(config, homebridgeApi, plugin) {
        super(config, homebridgeApi, plugin);
        this.state = 0;
    }

    getState(callback) {
        var me = this;
        callback(null, !!me.state);
    }

    setState(value, callback) {
        let me = this;
        let args = {
            data: {},
            headers: { 
                "Content-Type": "application/json" ,
                "authorization": me.plugin.securityToken
            }
        };
        let url = this.plugin.buildUrl("group/set", {
            time: 0,
            idx: this.config.groupId,
            onoff: (value) ? 1 : 0
        });
        this.state = (value) ? 1 : 0;
        me.plugin.restClient.get(url, args, function (data, response) {
            if(data.errorCode) {
                this.plugin.log.warn("Failed to set state: " + data.errorMessage);
            } else {
                if(callback) callback();
            }
        });
    }
}

module.exports = {
    Group: Group
}