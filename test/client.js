const Kofo = require('../index');
const fs = require('fs');
const _ = require('lodash');
const signUtil = require('./util/sign_util');


function run(privateKey, kofoId, clean, roleEnum) {
    const cachePath = `${__dirname}/cache/${roleEnum}.json`;

    function _read() {
        let data = fs.readFileSync(cachePath);
        return JSON.parse(data.toString());
    }

    function insertData(key, value) {
        let data = _read();
        data = Object.assign(data, {[key]: value});
        fs.writeFileSync(cachePath, JSON.stringify(data));
    }

    function readData(key) {
        let data = _read();
        return data[key];
    }

    function cleanCache() {
        fs.writeFileSync(cachePath, '{}');
    }

    clean && cleanCache();
    const kofo = Kofo.init({
        mqUrl: 'ws://pre.corp.kofo.io:30508/mqtt',
        mqOptions: {
            kofoId: kofoId,
            username: 'sub',
            password: '123'
        },
        gateway: "http://pre.corp.kofo.io:30509/gateway",
        settlement: "http://pre.corp.kofo.io:30509/settlement-server",
        insertData,
        readData
    });


    let signatureTxHandler = async function (data) {
        let {type, chain, currency, publicKey, rawTransaction, settlementId} = data;
        console.log(`Kofo signature notice 【${_.toUpper(data.type)}】 :`);
        console.log(data);
        console.log('\n');
        let chain_c = _.toUpper(chain);
        let signedRawTransaction = await signUtil(chain, currency, rawTransaction, privateKey[chain_c], publicKey);
        kofo.signatureCallback(type, chain, currency, settlementId, signedRawTransaction);
    };

    let listener = function (data) {
        console.log(`Kofo status notice 【${data.type}】 :`);
        console.log(data);
        console.log('\n');
    };

    kofo.subscribe('kofo_status_notice', listener);

    kofo.subscribe('kofo_tx_signature', signatureTxHandler);
}

module.exports = {
    run
};


