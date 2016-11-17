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
    
Important: the serial number is only the part before the dash.
