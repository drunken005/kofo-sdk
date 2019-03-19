const Identifier = require('../identifier/identifier');
const _ = require('lodash');

const EOS = require('./eos/eos_chain');
const ETH = require('./eth/eth_chain');
const Zilliqa = require('./zilliqa/zilliqa_chain');

const messageMapping = {
    [new Identifier("TRON", "TRON").toString()]: EOS,
    [new Identifier("BOS", "BOS").toString()]: EOS,
    [new Identifier("ETH", "ETH").toString()]: ETH,
    [new Identifier("ETH", "ZIL").toString()]: ETH,
    [new Identifier("ETH", "ZILLIQA").toString()]: ETH,
    [new Identifier("EOS", "EOS").toString()]: EOS,
    [new Identifier("ZILLIQA", "ZILLIQA").toString()]: Zilliqa,
    [new Identifier("ZILLIQA", "ZIL").toString()]: Zilliqa,
};

function ChainProvider() {
}

module.exports = ChainProvider;

ChainProvider.getProvider = function (identifier, mapping) {
    let errMsg = `Invalid ${identifier.toString()}`;
    let _instance = mapping[identifier.toString()];
    if (!_instance) {
        throw new Error(errMsg);
    }
    return _instance;
};
ChainProvider.init = function (chain, currency) {
    let identifier = new Identifier(chain, currency);
    let _instance = ChainProvider.getProvider(identifier, messageMapping);
    return new _instance();
};