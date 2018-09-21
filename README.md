# homebridge-lightify-api
Lightify Homebridge plugin which uses the official API

# OUTDATED
As I don't own any Lightify equipment anymore, I cant adapt the changes to the API. Please use https://www.npmjs.com/package/homebridge-lightify from now on.

## Installation

npm -g install homebridge-lightify-api

## Configuration

add the following to your ~/.homebridge/config.json

    ```
    {
        "platform": "Lightify API",
        "username": "xxx",
        "password": "xxx",
        "serialNumber": "YourBaseStationSerialNumber",

        "apiURL": "https://eu.lightify-api.org/lightify/services/",
        "fadeTime": 3,
        "exportGroups": "yes"
    }
    ```
    
###Parameters

* username is your Lightify account username
* password is your Lightify account password
* serialNumber is the first block (before the dash) of your Lightify hubs serial number

* fadeTime is optional and represents the fading duration between colors
* apiURL is optional and defaults to "https://eu.lightify-api.org/lightify/services/". You need to change it to "https://us.lightify-api.org/lightify/services/" for US, CA and AUS.
* exportGroups is optional and defaults to yes. If enabled, Lightify Groups get exported as device for homebridge

## Supported Devices

* OSRAM Lightify Plug
* OSRAM Lightify Flex RGBW
* OSRAM Lightify Bulbs (Only tested the A60 TW (tunable white), but others - including RGBW should work too.)

Please let me know if devices behave strange so I can fix it.

## Group Support

This plugin supports Lightify Groups, but they will appear as Plugs in Homekit (at least for the moment).
To enable support, the config option "exportGroups" must be set to "yes"
