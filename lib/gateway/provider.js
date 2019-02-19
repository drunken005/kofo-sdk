const Identifier = require('../identifier/identifier');

const EOS = require('./eos/eos_gateway');
const ETH = require('./eth/eth_gateway');
const Zilliqa = require('./zilliqa/zilliqa_gateway');

const gatewayMapping = {
    [new Identifier("ETH", "ETH").toString()]: ETH,
    [new Identifier("ETH", "ZIL").toString()]: ETH,
    [new Identifier("ETH", "ZILLIQA").toString()]: ETH,
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
GatewayProvider.init = function (chain, currency, url, timeout, level) {
    let identifier = new Identifier(chain, currency);
    let _instance = GatewayProvider.getProvider(identifier, gatewayMapping);
    return new _instance({
        identifier,
        url,
        level,
        timeout,
        label: "gateway"
    });
};
