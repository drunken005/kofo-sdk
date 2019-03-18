const Identifier = require('../../identifier/identifier');

const TRON = require('./tron');
const BOS = require('./bos/bos_callback');
const EOS = require('./eos/eos_callback');
const ETH = require('./eth/eth_callback');
const Zilliqa = require('./zilliqa/zilliqa_callback');

const callbackMapping = {
    [new Identifier("TRON", "TRON").toString()]: TRON,
    [new Identifier("BOS", "BOS").toString()]: BOS,
    [new Identifier("ETH", "ETH").toString()]: ETH,
    [new Identifier("ETH", "ZILLIQA").toString()]: ETH,
    [new Identifier("ETH", "ZIL").toString()]: ETH,
    [new Identifier("EOS", "EOS").toString()]: EOS,
    [new Identifier("ZILLIQA", "ZILLIQA").toString()]: Zilliqa,
    [new Identifier("ZILLIQA", "ZIL").toString()]: Zilliqa,
};

function CallbackProvider() {

}

module.exports = CallbackProvider;

CallbackProvider.getProvider = function (identifier, mapping) {
    let errMsg = `Invalid ${identifier.toString()}`;
    let _instance = mapping[identifier.toString()];
    if (!_instance) {
        throw new Error(errMsg);
    }
    return _instance;
};

CallbackProvider.init = function (chain, currency, event, config, cacheMap) {
    let identifier = new Identifier(chain, currency);
    let _instance = CallbackProvider.getProvider(identifier, callbackMapping);
    return new _instance(event, config, cacheMap);
};