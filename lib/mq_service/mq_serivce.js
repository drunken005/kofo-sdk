const Mqtt = require('mqtt');
const Logger = require('../logger/logger');
const EventEmitter = require("events");
const _ = require('lodash');

class MqService {
    constructor({mq, options}) {
        let mqtt = Mqtt.connect(mq, options);
        this.clientId = options.clientId;
        this.mqtt = mqtt;
        this.logger = Logger.getLogger();
        this.event = new EventEmitter();
        this.connect();
        this.MESSAGE_TYPE = 'mqtt_message_sub'
    }

    connect() {
        this.mqtt.on("error", this.onError.bind(this));
        this.mqtt.on("close", this.onClose.bind(this));
        this.mqtt.on("connect", this.onConnect.bind(this));
        this.mqtt.on("message", this.onMessage.bind(this));
        this.mqtt.on("reconnect", this.onReconnect.bind(this));
    }

    onError() {
        this.logger.info(`clientId=${this.clientId}||onError()`);
    }

    onConnect() {
        this.logger.info(`clientId=${this.clientId}||onConnect()`);
        this.mqtt.subscribe(this.clientId, (err) => {
            if (err) {
                this.logger.error(`clientId=${this.clientId}||onSubscribe(${MqService.errInfo(err)})`);
            }
        });
    }

    onClose() {
        this.logger.info(`clientId=${this.clientId}||onClose()`);
    }

    onReconnect() {
        this.logger.info(`clientId=${this.clientId}||onReconnect()`);
    }

    onMessage(topic, mqMessage) {
        let messageString = mqMessage.toString();
        // console.log(messageString);
        try {
            let messageObject = JSON.parse(messageString);
            if (!messageObject || !messageObject.body || !messageObject.body.type) {
                this.logger.error(`clientId=${this.clientId}||onMessageError()||InvalidData=${messageString}`);
                return;
            }
            let {body: message} = messageObject;
            this.event.emit(this.MESSAGE_TYPE, _.assign(_.omit(message.data, '@type'), _.pick(message, ['chain', 'currency', 'type'])));
        } catch (err) {
            this.logger.error(`clientId=${this.clientId}||onMessageError()||message=${messageString}||${MqService.errInfo(err)}`);
        }
    };

    static errInfo(err) {
        let message = err.message;
        let stack = err.stack ? err.stack.replace(/\r?\n\s*/g, "||") : "";
        return `message=${message}||stack=${stack}`;
    };

    subscribe(listener) {
        this.event.addListener(this.MESSAGE_TYPE, listener);
    }

}

module.exports = MqService;