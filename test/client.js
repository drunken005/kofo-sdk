const Kofo = require('../index');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const moment = require('moment');
const signUtil = require('./sign_util');


//
// const project_dir = process.env.PROJECT_DIR || process.env.PWD;
// let file = [moment(new Date()).format('YYYY-MM-DD'), 'log'].join('.');
// let logPath = path.join(project_dir, 'logs', file);

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

    const file = [moment(new Date()).format('YYYY-MM-DD'), 'log'].join('.');
    const logPath = path.join(__dirname, 'logs', file);

    const messagePath = path.join(__dirname, 'receiveMessage.js');

    const noticePath = path.join(__dirname, `${roleEnum}_notice.js`);

    function cleanCache() {
        fs.writeFileSync(cachePath, '{}');
        fs.writeFileSync(logPath, '');
        fs.writeFileSync(noticePath, '');
        fs.writeFileSync(messagePath, '');
    }

    clean && cleanCache();
    const kofo = Kofo.init({
        mq: 'ws://pre.corp.kofo.io:30508/mqtt',
        options: {
            kofoId: kofoId,
            username: 'sub',
            password: '123'
        },
        gateway: "http://pre.corp.kofo.io:30509/gateway",
        settlement: "http://pre.corp.kofo.io:30509/settlement-server",
        insertData,
        readData,
        debug: true,
        logPath,
        messagePath
    });

    let signatureTxHandler = async function (data) {
        let {type, chain, currency, publicKey, waitSign, settlementId} = data;
        console.log(`【SIGNATURE】SIGN TYPE ${_.toUpper(data.type)} =================================================================||||||||||||||||||||||||||||||||`);
        console.table([data]);
        let chain_c = _.toUpper(chain);
        let signed = await signUtil(chain, currency, waitSign, privateKey[chain_c], publicKey);

        console.log('SIGNATURE', `SIGN TYPE ${_.toUpper(data.type)} =================================================================||||||||||||||||||||||||||||||||`);
        console.table([data]);
        kofo.signatureCallback(type, chain, currency, settlementId, signed);
    };

    let listener = function (data) {
        console.log('==============================================================kofo status notice====================================');
        console.table([data]);
        let m = `const ${data.type || 'init_sdk'} = ${JSON.stringify(data)}; \n`;
        fs.appendFileSync(noticePath, m);
    };

    kofo.subscribe('kofo_status_notice', listener);

    kofo.subscribe('kofo_tx_signature', signatureTxHandler);
}

module.exports = {
    run
};


