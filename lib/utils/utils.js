const {MQ_MESSAGE_TYPE, SIGN_CALLBACK_TYPE} = require('../common/constant');
const Crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const {tableStr} = require('./cache_util');
const _ = require('lodash');
const ECKey = require('eckey');
const conv = require('binstring');
const secureRandom = require('secure-random');

const messageType = function (type, provider) {
    let mappings = {
        [MQ_MESSAGE_TYPE.makerCreateRefundTxAndH]: provider.makerCreateRefund,
        [MQ_MESSAGE_TYPE.takerReceiveHAndCreateRefundTx]: provider.takerCreateRefund,

        [MQ_MESSAGE_TYPE.makerSubmitHashLockTx]: provider.makerSubmitHashLockTx,
        [MQ_MESSAGE_TYPE.takerSubmitHashLockTx]: provider.takerSubmitHashLockTx,

        [MQ_MESSAGE_TYPE.makerSubmitWithdrawTx]: provider.makerSubmitWithdrawTx,
        [MQ_MESSAGE_TYPE.takerSubmitWithdrawTx]: provider.takerSubmitWithdrawTx,

        [MQ_MESSAGE_TYPE.makerSubmitRefundTx]: provider.makerSubmitRefundTx,
        [MQ_MESSAGE_TYPE.takerSubmitRefundTx]: provider.takerSubmitRefundTx,

        [MQ_MESSAGE_TYPE.makerSubmitApproveTx]: provider.makerSubmitApproveTx,
        [MQ_MESSAGE_TYPE.takerSubmitApproveTx]: provider.takerSubmitApproveTx,

        [MQ_MESSAGE_TYPE.makerFinalStatusNotify]: provider.makerFinalStatusNotify,
        [MQ_MESSAGE_TYPE.takerFinalStatusNotify]: provider.takerFinalStatusNotify,

    };
    return mappings[type];
};


const signatureCallbackType = function (type, provider) {
    let mappings = {
        [SIGN_CALLBACK_TYPE.makerHashLockTxSign]: provider.makerHashLockTxSignCallback,
        [SIGN_CALLBACK_TYPE.takerHashLockTxSign]: provider.takerHashLockTxSignCallback,

        [SIGN_CALLBACK_TYPE.makerWithdrawTxSign]: provider.makerWithdrawTxSignCallback,
        [SIGN_CALLBACK_TYPE.takerWithdrawTxSign]: provider.takerWithdrawTxSignCallback,

        [SIGN_CALLBACK_TYPE.makerRefundTxSign]: provider.makerRefundTxSignCallback,
        [SIGN_CALLBACK_TYPE.takerRefundTxSign]: provider.takerRefundTxSignCallback,

        [SIGN_CALLBACK_TYPE.makerApproveTxSign]: provider.makerApproveTxSignCallback,
        [SIGN_CALLBACK_TYPE.takerApproveTxSign]: provider.takerApproveTxSignCallback

    };
    return mappings[type];
};

const sha256 = function (data, encoding = "hex") {
    return Crypto.createHash("sha256").update(data).digest(encoding);
};

const sha256Twice = function (data, encoding = "hex") {
    let __tmp__ = Crypto.createHash("sha256").update(data).digest();
    return sha256(__tmp__, encoding);
};

const createPreImage = function (length = 128) {
    let preImage = [];
    let flags = [0, 0, 0];
    let i = 0;

    while (flags[0] === 0 || flags[1] === 0 || flags[2] === 0 || i < length) {
        i = i % length;
        let f = Math.floor(Math.random() * 3);

        if (f === 0) {
            preImage[i] = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        } else if (f === 1) {
            preImage[i] = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        } else {
            preImage[i] = Math.floor(Math.random() * 10);
        }

        flags[f] = 1;
        i++;
    }

    return preImage.join("");
};

let project_dir = process.env.PROJECT_DIR || process.env.PWD;

const writeLog = function (label, desc, obj, up = false) {
    let file = [moment(new Date()).format('YYYY-MM-DD'), 'log'].join('.');
    let logPath = path.join(project_dir, 'logs', file);
    if (up) {
        desc = _.toUpper('【' + label + '】' + desc) + '\n';
    } else {
        desc = '【' + _.toUpper(label) + '】' + desc + '\n';
    }
    if (obj && !_.isEmpty(obj)) {
        desc += tableStr([obj]) + '\n\n\n';
    }
    if (_.toUpper(label) === 'SETTLEMENT') {
        desc += '\n\n\n\n\n\n';
    }
    fs.appendFileSync(logPath, desc);
};

const createKofoId = function () {
    const bytes = secureRandom(32);
    const key = new ECKey(bytes, true);
    let kofoId = key.publicKey.toString('hex');
    let secret = key.privateKey.toString('hex');
    return {kofoId, secret};
};

module.exports = {
    messageType,
    signatureCallbackType,
    sha256,
    sha256Twice,
    createPreImage,
    writeLog,
    createKofoId
};