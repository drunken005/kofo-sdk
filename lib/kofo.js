const MqService = require('./mq_service/mq_serivce');
const EventEmitter = require("events");
const logger = require('./logger/logger').getLogger();
const {messageHandlerMapping, signatureCallbackMapping} = require('./mapping/mapping');
const {CallbackProvider, MessageProvider} = require('./oracle/provider');


function Kofo() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this._event = new EventEmitter();
    this._config = config;
    this._cacheMap = new Map();
    this._mqService = new MqService(config, this._event);
    this._mqService.subscribe(this._messageSchedule.bind(this));
}

module.exports = Kofo;

Kofo.prototype._messageSchedule = function (message) {
    const _self = this;
    let messageProvider = MessageProvider.init(message.chain, message.currency, _self._event, _self._config, _self._cacheMap);
    let messageHandler = messageHandlerMapping(message.type, messageProvider);
    if (!messageHandler) {
        logger.error(`kofoId=${this._mqService.kofoId}||onMessageError()||InvalidType=${message.type}`);
        return;
    }
    messageHandler.call(messageProvider, message).catch(err => {
        logger.error(`kofoId=${this._mqService.kofoId}||onMessageHandler()||${MqService.errInfo(err)}`);
    });
};

/**
 * @description Client receives message then signed callback
 * @param type Signature message type (required)
 * @param chain Blockchain corresponding to the signature (required)
 * @param currency Currency of the transaction (required)
 * @param settlementId  settlement order id (required)
 * @param signedRawTransaction Signed object (required)
 */
Kofo.prototype.signatureCallback = function (type, chain, currency, settlementId, signedRawTransaction) {
    let roleEnum = type.split('_').slice(0, 1).toString().toUpperCase(),
        signCallType = type.split('_').slice(1).join('_');
    const _self = this;
    let callbackProvider = CallbackProvider.init(chain, currency, _self._event, _self._config, _self._cacheMap);
    let signatureHandler = signatureCallbackMapping(signCallType, callbackProvider);
    if (!signatureHandler) {
        logger.error(`signature callback=${[chain, currency].join('/')}||onHandlerError()||InvalidType=${event}`);
        return;
    }

    signatureHandler.call(callbackProvider, roleEnum, settlementId, signedRawTransaction).catch(err => {
        logger.error(`signature callback=${[chain, currency].join('/')}||onSignatureCallback()||${MqService.errInfo(err)}`);
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