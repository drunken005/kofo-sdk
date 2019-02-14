const _ = require('lodash');
const ecc = require('eosjs-ecc');
const zilC = require('@zilliqa-js/crypto');
const {Wallet: __wallet__, utils} = require("ethers");

const Identifier = require('../lib/identifier/identifier');

function EosSign(privateKey, signObj) {
    console.log('EOS sign ==================>', privateKey, signObj);
    if (_.isArray(signObj)) {
        return _.map(signObj, (doc) => {
            return ecc.signHash(doc, privateKey);
        })
    }
    return ecc.signHash(signObj, privateKey);

}

async function EthSign(privateKey, signObj) {
    console.log('ETH sign ==================>', privateKey, signObj);
    let wallet = new __wallet__(privateKey);
    let tx = utils.parseTransaction(signObj);
    return await wallet.sign(tx);
}

/**
 * @return {string}
 */
function ZilliqaSign(privateKey, signObj, publicKey) {
    console.log('ZIL sign ==================>', privateKey, signObj, publicKey);
    return zilC.sign(signObj, privateKey, publicKey);
}

const signMappings = {
    [new Identifier("ETH", "ETH").toString()]: EthSign,
    [new Identifier("ETH", "ZILLIQA").toString()]: EthSign,
    [new Identifier("ETH", "ZIL").toString()]: EthSign,
    [new Identifier("EOS", "EOS").toString()]: EosSign,
    [new Identifier("ZILLIQA", "ZILLIQA").toString()]: ZilliqaSign,
    [new Identifier("ZILLIQA", "ZIL").toString()]: ZilliqaSign,
};


function signProvider(chain, currency, signObj, privateKey, publicKey) {
    let identifier = new Identifier(chain, currency);
    let errMsg = `Invalid ${identifier.toString()}`;
    let _instance = signMappings[identifier.toString()];
    if (!_instance) {
        throw new Error(errMsg);
    }
    return _instance(privateKey, signObj, publicKey);
}

module.exports = signProvider;