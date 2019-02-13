const Identifier = require('../../identifier/identifier');

const EOS = require('./eos/eos_callback');
const ETH = require('./eth/eth_callback');
const ERC20 = require('./erc20/erc20_callback');
const Zilliqa = require('./zilliqa/zilliqa_callback');

const callbackMapping = {
    [new Identifier("ETH", "ETH").toString()]: ETH,
    [new Identifier("ETH", "ZIL").toString()]: ERC20,
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

CallbackProvider.init = function (chain, currency, event, config) {
    let identifier = new Identifier(chain, currency);
    let _instance = CallbackProvider.getProvider(identifier, callbackMapping);
    return new _instance(event, config, 'callback');
};