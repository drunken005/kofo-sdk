const Mqtt = require('mqtt');
const Logger = require('../logger/logger');
const EventEmitter = require("events");
const _ = require('lodash');
const {KOFO_EVENT_TYPE, NOTICE_TYPE} = require('../common/constant');
const MQTT_CONNECT_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    FAILED: 'failed'
};

/**
 * MQTT service
 */
class MqService {
    constructor({mqUrl, mqOptions, resetOptions}, event) {
        this.statusEvent = event;
        this.mqUrl = mqUrl;
        this.mqOptions = mqOptions;
        this.resetOptions = resetOptions;
        this.logger = Logger.getLogger();
        this.event = new EventEmitter();
        this.MESSAGE_TYPE = 'mqtt_message_sub';
        this.init();
    }

    /**
     * Init mqtt client
     */
    init() {
        let {username, password, kofoId: clientId} = this.mqOptions;
        this.mqtt = Mqtt.connect(this.mqUrl, {username, password, clientId});
        this.connect();
        this.kofoId = this.mqOptions.kofoId;
    }

    connect() {
        this.mqtt.on("error", this.onError.bind(this));
        this.mqtt.on("close", this.onClose.bind(this));
        this.mqtt.on("connect", this.onConnect.bind(this));
        this.mqtt.on("message", this.onMessage.bind(this));
        this.mqtt.on("reconnect", this.onReconnect.bind(this));
    }

    /**
     * @description Connection error
     * @param error
     */
    async onError(error) {
        this.logger.info(`kofoId=${this.kofoId}, connect mqtt onError(), message = ${error.message}`);
        this.statusNotice(MQTT_CONNECT_STATUS.ERROR, error.message);
        this.mqtt.end(true);
        if (!this.resetOptions || !_.isFunction(this.resetOptions)) {
            return;
        }
        let mqOptions = await this.resetOptions();
        if (!mqOptions || !mqOptions.hasOwnProperty('username')) {
            return;
        }
        this.mqOptions = mqOptions;
        this.init();
        this.logger.info(`kofoId=${this.kofoId}, re-sign username and password.`);
    }

    /**
     * @description MQTT connected event
     */
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

    /**
     * @description MQTT close event
     */
    onClose() {
        this.logger.info(`kofoId=${this.kofoId}||onClose()`);
        this.statusNotice(MQTT_CONNECT_STATUS.FAILED, `mqtt server disconnect`);
    }

    /**
     * @description MQTT reconnect event
     */
    onReconnect() {
        this.logger.info(`kofoId=${this.kofoId}||onReconnect()`);
        this.statusNotice(MQTT_CONNECT_STATUS.SUCCESS, `mqtt server reconnect`);
    }

    /**
     * @description MQTT success subscribe clintId and receive message handler
     * @param topic
     * @param mqMessage
     */
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

    /**
     * @description MTQQ Error handler
     * @param err
     * @returns {string}
     */
    static errInfo(err) {
        let message = err.message;
        let stack = err.stack ? err.stack.replace(/\r?\n\s*/g, "||") : "";
        return `message=${message}||stack=${stack}`;
    };

    /**
     * @description Init sdk notice client mqtt status
     * @param status
     * @param message
     */
    statusNotice(status, message) {
        this.statusEvent.emit(KOFO_EVENT_TYPE.STATUS_NOTICE, {type: NOTICE_TYPE.INIT_SDK, status, message})
    }


    /**
     * @description Provide kofo message handler and event emitter
     * @param listener
     */
    subscribe(listener) {
        this.event.addListener(this.MESSAGE_TYPE, listener);
    }

}

module.exports = MqService;