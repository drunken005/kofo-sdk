const _ = require('lodash');
const ecc = require('eosjs-ecc');
const zilC = require('@zilliqa-js/crypto');
const {Wallet: __wallet__, utils} = require("ethers");

const Identifier = require('../../lib/identifier/identifier');

function EosSign(privateKey, rawTransaction) {
    if (_.isArray(rawTransaction)) {
        return _.map(rawTransaction, (doc) => {
            return ecc.signHash(doc, privateKey);
        })
    }
    return ecc.signHash(rawTransaction, privateKey);

}

async function EthSign(privateKey, rawTransaction) {
    let wallet = new __wallet__(privateKey);
    let tx = utils.parseTransaction(rawTransaction);
    return await wallet.sign(tx);
}

/**
 * @return {string}
 */
function ZilliqaSign(privateKey, rawTransaction, publicKey) {
    return zilC.sign(rawTransaction, privateKey, publicKey);
}

const signMappings = {
    [new Identifier("ETH", "ETH").toString()]: EthSign,
    [new Identifier("ETH", "ZILLIQA").toString()]: EthSign,
    [new Identifier("ETH", "ZIL").toString()]: EthSign,
    [new Identifier("EOS", "EOS").toString()]: EosSign,
    [new Identifier("ZILLIQA", "ZILLIQA").toString()]: ZilliqaSign,
    [new Identifier("ZILLIQA", "ZIL").toString()]: ZilliqaSign,
};


function signProvider(chain, currency, rawTransaction, privateKey, publicKey) {
    let identifier = new Identifier(chain, currency);
    let errMsg = `Invalid ${identifier.toString()}`;
    let _instance = signMappings[identifier.toString()];
    if (!_instance) {
        throw new Error(errMsg);
    }
    return _instance(privateKey, rawTransaction, publicKey);
}

module.exports = signProvider;