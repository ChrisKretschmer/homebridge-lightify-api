# homebridge-lightify-api
Lightify Homebridge plugin which uses the official API

## Installation

npm -g install homebridge-lightify-api

## Configuration

add the following to your ~/.homebridge/config.json

    ```
    {
        "platform": "Lightify API",
        "username": "xxx",
        "password": "xxx",
        "serialNumber": "YourBaseStationSerialNumber"
    }
    ```
    
Important: enter only the first block of the serial number (before the dash).

## Supported Devices

* OSRAM Lightify Plug
* OSRAM Lightify Flex RGBW
* OSRAM Lightify Bulbs (Only tested the A60 TW (tunable white), but others - including RGBW should work too.)

Please let me know if devices behave strange so I can fix it.