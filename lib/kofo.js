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
    Util.writeMessage(w);
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
 * @param event
 * @param chain
 * @param currency
 * @param settlementId
 * @param signedObj
 */
Kofo.prototype.signatureCallback = function (type, chain, currency, settlementId, signedObj) {
    let callbackProvider = CallbackProvider.init(chain, currency, this._event, this._config);

    let signatureHandler = Util.signatureCallbackType(type, callbackProvider);
    if (!signatureHandler) {
        this._logger.error(`signature callback=${[chain, currency].join('/')}||onHandlerError()||InvalidType=${event}`);
        return;
    }
    signatureHandler.call(callbackProvider, settlementId, signedObj).catch(err => {
        this._logger.error(`signature callback=${[chain, currency].join('/')}||onSignatureCallback()||${MqService.errInfo(err)}`);
    });
};

/**
 * desc: client call the method， sign callback and status handler
 * @param type
 * @param listener
 */
Kofo.prototype.subscribe = function (type, listener) {
    this._event.addListener(type, listener)
};

/**
 * desc: call the method init Kofo SDK
 * @returns {Kofo}
 */
Kofo.init = function () {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Kofo(config);
};

Kofo.createKofoId = function () {
  return Util.createKofoId();
};

