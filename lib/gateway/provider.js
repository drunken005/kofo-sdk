const Identifier = require('../identifier/identifier');

const EOS = require('./eos/eos_gateway');
const ETH = require('./eth/eth_gateway');
const ERC20 = require('./erc20/erc20_gateway');
const Zilliqa = require('./zilliqa/zilliqa_gateway');

const gatewayMapping = {
    [new Identifier("ETH", "ETH").toString()]: ETH,
    [new Identifier("ETH", "ZIL").toString()]: ERC20,
    [new Identifier("ETH", "ZILLIQA").toString()]: ERC20,
    [new Identifier("EOS", "EOS").toString()]: EOS,
    [new Identifier("ZILLIQA", "ZILLIQA").toString()]: Zilliqa,
    [new Identifier("ZILLIQA", "ZIL").toString()]: Zilliqa,
};

function GatewayProvider() {

}

module.exports = GatewayProvider;

GatewayProvider.getProvider = function (identifier, mapping) {
    let errMsg = `Invalid ${identifier.toString()}`;
    let _instance = mapping[identifier.toString()];
    if (!_instance) {
        throw new Error(errMsg);
    }
    return _instance;
};
GatewayProvider.init = function (chain, currency, debug, url, timeout, level) {
    let identifier = new Identifier(chain, currency);
    let _instance = GatewayProvider.getProvider(identifier, gatewayMapping);
    return new _instance({
        identifier,
        url,
        level,
        timeout,
        label: "gateway",
        debug
    });
};
