const Mqtt = require('mqtt');
const Logger = require('../logger/logger');
const EventEmitter = require("events");
const _ = require('lodash');
const {KOFO_EVENT_TYPE} = require('../common/constant');
const MQTT_CONNECT_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    FAILED: 'failed'
};

class MqService {
    constructor({mq, options}, event) {
        this.statusEvent = event;
        let {username, password, kofoId: clientId} = options;
        this.mqtt = Mqtt.connect(mq, {username, password, clientId});
        this.kofoId = options.kofoId;
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

    onError(error) {
        this.logger.info(`kofoId=${this.kofoId}||onError()`);
        this.statusNotice(MQTT_CONNECT_STATUS.ERROR, error.message);
    }

    onConnect() {
        this.logger.info(`kofoId=${this.kofoId}||onConnect()`);
        this.mqtt.subscribe(this.kofoId, (err) => {
            if (err) {
                this.logger.error(`clientId=${this.kofoId}||onSubscribe(${MqService.errInfo(err)})`);
                return this.statusNotice(MQTT_CONNECT_STATUS.FAILED, `subscribe kofoId: ${this.kofoId} error, ${err.message}`);
            }
            this.statusNotice(MQTT_CONNECT_STATUS.SUCCESS, `Init sdk success and connected mqtt server.`);
        });
    }

    onClose() {
        this.logger.info(`kofoId=${this.kofoId}||onClose()`);
        this.statusNotice(MQTT_CONNECT_STATUS.FAILED, `mqtt server disconnect`);
    }

    onReconnect() {
        this.logger.info(`kofoId=${this.kofoId}||onReconnect()`);
        this.statusNotice(MQTT_CONNECT_STATUS.SUCCESS, `mqtt server reconnect`);
    }

    onMessage(topic, mqMessage) {
        let messageString = mqMessage.toString();
        try {
            let messageObject = JSON.parse(messageString);
            if (!messageObject || !messageObject.body || !messageObject.body.type) {
                this.logger.error(`kofoId=${this.kofoId}||onMessageError()||InvalidData=${messageString}`);
                return;
            }
            let {body: message} = messageObject;
            this.event.emit(this.MESSAGE_TYPE, _.assign(_.omit(message.data, '@type'), _.pick(message, ['chain', 'currency', 'type'])));
        } catch (err) {
            this.logger.error(`kofoId=${this.kofoId}||onMessageError()||message=${messageString}||${MqService.errInfo(err)}`);
        }
    };

    static errInfo(err) {
        let message = err.message;
        let stack = err.stack ? err.stack.replace(/\r?\n\s*/g, "||") : "";
        return `message=${message}||stack=${stack}`;
    };

    statusNotice(status, message) {
        this.statusEvent.emit(KOFO_EVENT_TYPE.notice, {status, message})
    }


    subscribe(listener) {
        this.event.addListener(this.MESSAGE_TYPE, listener);
    }

}

module.exports = MqService;