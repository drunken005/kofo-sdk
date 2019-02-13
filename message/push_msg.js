const mqtt = require('mqtt');

function pushMessageToSdk(body) {
    let client = mqtt.connect('http://127.0.0.1:1883');
    client.on('connect', function () {
        client.subscribe('presence', function (err) {
            if (!err) {
                client.publish('kofo_sdk_client', JSON.stringify({body}));
                client.end()
            }
        })
    });
}

module.exports = pushMessageToSdk;