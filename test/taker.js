const Kofo = require('../index');
const fs = require('fs');
const util = require('../lib/utils/utils');
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
let file = [moment(new Date()).format('YYYY-MM-DD'), 'taker','log'].join('.');
let logPath = path.join(project_dir, 'logs', file);

let cleanCache = function () {
    fs.writeFileSync(taker, '{}');
    fs.writeFileSync(maker, '{}');
    fs.writeFileSync(logPath, '');
};

function run() {

    // cleanCache();
    let config = {
        mq: 'ws://pre.corp.kofo.io:30508/mqtt',
        options: {
            clientId: '023fbf8ded0155ef73b25c19e20a4a92f984ffe621e8d1b0a2572e593469c1016e', //79b8c5ea8cf8a3c23125680e25124e0702e811dd305c857f089d7ac736dd11b5
            username: 'sub',
            password: '123'
        },
        gateway: "http://pre.corp.kofo.io:30509/gateway",
        settlement: "http://pre.corp.kofo.io:30509/settlement-server",
        insertData: insertData,
        readData: readData,
        debug: true
    };
    let kofo = Kofo.init(config);

    let signatureTxHandler = async function (data) {

        const {Wallet: __wallet__, utils} = require("ethers");

        let wallet = new __wallet__('02DB31472EB7FF0F42C8E815BFAA541CE563AA894CB3A66E4C6616427A6BD954');

        console.log(`【SIGNATURE】SIGN TYPE ${_.toUpper(data.type)} =================================================================||||||||||||||||||||||||||||||||`);
        console.table([data]);

        let tx = utils.parseTransaction(data.waitSign);

        let signed = await wallet.sign(tx);

        console.log('\n');
        util.writeLog('SIGNATURE', `SIGN TYPE ${_.toUpper(data.type)} =================================================================||||||||||||||||||||||||||||||||`, data);
        kofo.signatureCallback(data.type, data.chain, data.currency, data.settlementId, signed);
    };

    let listener = function (data) {
        //do something
        console.log('==============================================================kofo status notice====================================');
        console.log(data)
    };

    kofo.subscribe('kofo_status_notice', listener);

    kofo.subscribe('kofo_tx_signature', signatureTxHandler);
}

run();


