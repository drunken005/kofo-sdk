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
let file = [moment(new Date()).format('YYYY-MM-DD'), 'maker', 'log'].join('.');
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
            clientId: '02a95024e899468bbe2e091444cd01366b141f1209faef9a3cf76eeb383b7dcfe1', //bd1e22ef1c60ffdaf89bc6c82019e8548f6e52253dde74e428e16cd337466666
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

        let wallet = new __wallet__('07FED02BDB20EFE5297445472E2AD0647C9E288A5E28A4E0C7C18CEEFC09B470');

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
// const obj = Kofo.createKofoId();
// console.log(obj);


