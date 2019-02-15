const Identifier = require('../../identifier/identifier');
const _ = require('lodash');

const EOS = require('./eos/eos_oracle');
const ETH = require('./eth/eth_oracle');
const Zilliqa  = require('./zilliqa/zilliqa_oracle');

const messageMapping = {
    [new Identifier("ETH", "ETH").toString()]: ETH,
    [new Identifier("ETH", "ZILLIQA").toString()]: ETH,
    [new Identifier("ETH", "ZIL").toString()]: ETH,
    [new Identifier("EOS", "EOS").toString()]: EOS,
    [new Identifier("ZILLIQA", "ZILLIQA").toString()]: Zilliqa,
    [new Identifier("ZILLIQA", "ZIL").toString()]: Zilliqa,
};

function MessageProvider() {
}

module.exports = MessageProvider;

MessageProvider.getProvider = function (identifier, mapping) {
    let errMsg = `Invalid ${identifier.toString()}`;
    let _instance = mapping[identifier.toString()];
    if (!_instance) {
        throw new Error(errMsg);
    }
    return _instance;
};
MessageProvider.init = function (chain, currency, event, config) {
    let identifier = new Identifier(chain, currency);
    let _instance = MessageProvider.getProvider(identifier, messageMapping);
    return new _instance(event, config, 'oracle');
};