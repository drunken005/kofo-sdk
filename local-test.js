const Kofo = require('./lib/kofo');
const fs = require('fs');
const util = require('./lib/utils/utils');
const _ = require('lodash');
const path = require('path');
const moment = require('moment');

const maker = __dirname + '/cache/maker.json';
const taker = __dirname + '/cache/taker.json';

let _read = function (isMaker) {
    let data = fs.readFileSync(isMaker ? maker : taker);
    return JSON.parse(data.toString());
};

let insertData = function (key, value, isMaker) {
    let data = _read(isMaker);
    data = Object.assign(data, {[key]: value});

    fs.writeFileSync(isMaker ? maker : taker, JSON.stringify(data));
};

let readData = function (key, isMaker) {
    let data = _read(isMaker);
    return data[key];
};
let project_dir = process.env.PROJECT_DIR || process.env.PWD;
let file = [moment(new Date()).format('YYYY-MM-DD'), 'log'].join('.');
let logPath = path.join(project_dir, 'logs', file);
let cleanCache = function () {
    fs.writeFileSync(taker, '{}');
    fs.writeFileSync(maker, '{}');
    fs.writeFileSync(logPath, '');
};

function run() {

    cleanCache();
    let config = {
        mq: 'http://pre.corp.kofo.io:30514',
        options: {
            clientId: 'kofo_sdk_client'
        },
        gateway: "http://pre.corp.kofo.io:30509/gateway/",
        settlement: "http://pre.corp.kofo.io:30509/settlement-server/",
        insertData: insertData,
        readData: readData,
        debug: true
    };
    let kofo = Kofo.init(config);

    let signatureTxHandler = function (data) {
        console.log(`【SIGNATURE】SIGN TYPE ${_.toUpper(data.type)} =================================================================||||||||||||||||||||||||||||||||`);
        console.table([data]);
        let signedStr;
        if (data.chain === 'eos') {
            signedStr = util.sha256(data.waitSign.join(''))
        } else {
            signedStr = util.sha256(data.waitSign)
        }
        console.log('\n');
        util.writeLog('SIGNATURE', `SIGN TYPE ${_.toUpper(data.type)} =================================================================||||||||||||||||||||||||||||||||`, data);
        kofo.signatureCallback(data.type, data.chain, data.currency, data.settlementId, signedStr);
    };

    let listener = function (data) {
        //do something
        console.log('==============================================================kofo status notice====================================');
        console.log(data)
    };

    kofo.subscribe('kofo_status_notice', listener);

    kofo.subscribe('kofo_tx_signature', signatureTxHandler);
    //
    // kofo.subscribe('taker_hash_lock_tx_sign', signatureTxhandler);
    //
    // kofo.subscribe('maker_withdraw_tx_sign', signatureTxhandler);
    //
    // kofo.subscribe('taker_withdraw_tx_sign', signatureTxhandler);
    //
    // kofo.subscribe('maker_refund_tx_sign', signatureTxhandler);
    //
    // kofo.subscribe('taker_refund_tx_sign', signatureTxhandler);
    //
    // kofo.subscribe('maker_approve_tx_sign', signatureTxhandler);
    //
    // kofo.subscribe('taker_approve_tx_sign', signatureTxhandler);

    // kofo.subscribe('maker_hash_lock_done', console.log)
}

// run();
const obj = Kofo.createKofoId();
console.log(obj);


