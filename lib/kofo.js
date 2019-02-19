const MqService = require('./mq_service/mq_serivce');
const EventEmitter = require("events");
const Logger = require('./logger/logger');
const Util = require('./utils/utils');
const {CallbackProvider, MessageProvider} = require('./oracle/provider');


function Kofo() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this._event = new EventEmitter();
    this._config = config;
    let mqService = new MqService(config, this._event);
    mqService.subscribe(this._messageSchedule.bind(this));
    this._logger = Logger.getLogger();
    this._mqService = mqService;
}

module.exports = Kofo;

Kofo.prototype._messageSchedule = function (message) {
    let w = `const ${message.type} = ${JSON.stringify(message)};`;
    Util.writeMessage(w, this._config.messagePath);
    let messageProvider = MessageProvider.init(message.chain, message.currency, this._event, this._config);
    let messageHandler = Util.messageType(message.type, messageProvider);
    if (!messageHandler) {
        this._logger.error(`kofoId=${this._mqService.kofoId}||onMessageError()||InvalidType=${message.type}`);
        return;
    }
    messageHandler.call(messageProvider, message).catch(err => {
        this._logger.error(`kofoId=${this._mqService.kofoId}||onMessageHandler()||${MqService.errInfo(err)}`);
    });
};

/**
 * @description Client receives message then signed callback
 * @param type Signature message type (required)
 * @param chain Blockchain corresponding to the signature (required)
 * @param currency Currency of the transaction (required)
 * @param settlementId  settlement order id (required)
 * @param signedObj Signed object (required)
 */
Kofo.prototype.signatureCallback = function (type, chain, currency, settlementId, signedObj) {
    let roleEnum = type.split('_').slice(0, 1).toString().toUpperCase(),
        signCallType = type.split('_').slice(1).join('_');
    let callbackProvider = CallbackProvider.init(chain, currency, this._event, this._config);
    let signatureHandler = Util.signatureCallbackType(signCallType, callbackProvider);
    if (!signatureHandler) {
        this._logger.error(`signature callback=${[chain, currency].join('/')}||onHandlerError()||InvalidType=${event}`);
        return;
    }

    signatureHandler.call(callbackProvider, roleEnum, settlementId, signedObj).catch(err => {
        this._logger.error(`signature callback=${[chain, currency].join('/')}||onSignatureCallback()||${MqService.errInfo(err)}`);
    });
};

/**
 * @description Client call the method， receive transaction sign message and status message
 * @param type Values: kofo_tx_signature || kofo_status_notice
 * @param listener Message  handler method
 */
Kofo.prototype.subscribe = function (type, listener) {
    this._event.addListener(type, listener)
};

/**
 * @description: Call the method init Kofo SDK
 * @returns {Kofo}
 */
Kofo.init = function () {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Kofo(config);
};

/**
 * @description Provides kofo id creator
 * @returns {{kofoId, secret}}
 */
Kofo.createKofoId = function () {
    return Util.createKofoId();
};