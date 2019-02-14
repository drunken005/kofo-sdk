const Kofo = require('../index');
const fs = require('fs');
const util = require('../lib/utils/utils');
const _ = require('lodash');
const path = require('path');
const moment = require('moment');
const signUtil = require('./sign_util');

const maker = __dirname + '/cache/maker.json';
const taker = __dirname + '/cache/taker.json';

function _read(isMaker) {
    let data = fs.readFileSync(isMaker ? maker : taker);
    return JSON.parse(data.toString());
}

function insertData(key, value, isMaker) {
    let data = _read(isMaker);
    data = Object.assign(data, {[key]: value});

    fs.writeFileSync(isMaker ? maker : taker, JSON.stringify(data));
}

function readData(key, isMaker) {
    let data = _read(isMaker);
    return data[key];
}

const project_dir = process.env.PROJECT_DIR || process.env.PWD;
const file = [moment(new Date()).format('YYYY-MM-DD'), 'log'].join('.');
const logPath = path.join(project_dir, 'logs', file);

function cleanCache() {
    fs.writeFileSync(taker, '{}');
    fs.writeFileSync(maker, '{}');
    fs.writeFileSync(logPath, '');
}


function run(privateKey, kofoId, clean) {
    clean && cleanCache();
    const kofo = Kofo.init({
        mq: 'ws://pre.corp.kofo.io:30508/mqtt',
        options: {
            clientId: kofoId,
            username: 'sub',
            password: '123'
        },
        gateway: "http://pre.corp.kofo.io:30509/gateway",
        settlement: "http://pre.corp.kofo.io:30509/settlement-server",
        insertData,
        readData,
        debug: true
    });

    let signatureTxHandler = async function (data) {
        let {type, chain, currency, publicKey, waitSign, settlementId} = data;
        console.log(`【SIGNATURE】SIGN TYPE ${_.toUpper(data.type)} =================================================================||||||||||||||||||||||||||||||||`);
        console.table([data]);
        let signed = await signUtil(chain, currency, waitSign, privateKey, publicKey);

        util.writeLog('SIGNATURE', `SIGN TYPE ${_.toUpper(data.type)} =================================================================||||||||||||||||||||||||||||||||`, data);
        kofo.signatureCallback(type, chain, currency, settlementId, signed);
    };

    let listener = function (data) {
        console.log('==============================================================kofo status notice====================================');
        console.log(data)
    };

    kofo.subscribe('kofo_status_notice', listener);

    kofo.subscribe('kofo_tx_signature', signatureTxHandler);
}

module.exports = {
    run
};


