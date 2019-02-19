const {SIGN_CALLBACK_TYPE, MESSAGE_STORAGE_KEYS} = require('../common/constant');
const Crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const {tableStr} = require('./cache_util');
const _ = require('lodash');
const ECKey = require('eckey');
const secureRandom = require('secure-random');

/**
 * @description Mqtt message handler method mappings
 * @param type
 * @param provider
 * @returns {*}
 */
const messageType = function (type, provider) {
    type = type.split('_').slice(1).join('_');
    let mappings = {
        [MESSAGE_STORAGE_KEYS.createRefundTxAndH]: provider.createRefundHandler,
        [MESSAGE_STORAGE_KEYS.receiveHAndCreateRefundTx]: provider.createRefundHandler,
        [MESSAGE_STORAGE_KEYS.submitHashLockTx]: provider.submitHashLockTxHandler,
        [MESSAGE_STORAGE_KEYS.submitWithdrawTx]: provider.submitWithdrawTxHandler,
        [MESSAGE_STORAGE_KEYS.submitRefundTx]: provider.submitRefundTxHandler,
        [MESSAGE_STORAGE_KEYS.submitApproveTx]: provider.submitApproveTxHandler,
        [MESSAGE_STORAGE_KEYS.finalStatusNotify]: provider.finalStatusHandler
    };
    return mappings[type];
};

/**
 * @description Signed callback handler method mappings
 * @param type
 * @param provider
 * @returns {*}
 */
const signatureCallbackType = function (type, provider) {
    let mappings = {
        [SIGN_CALLBACK_TYPE.hashLockTxSign]: provider.hashLockTxSignCallback,
        [SIGN_CALLBACK_TYPE.withdrawTxSign]: provider.withdrawTxSignCallback,
        [SIGN_CALLBACK_TYPE.refundTxSign]: provider.refundTxSignCallback,
        [SIGN_CALLBACK_TYPE.approveTxSign]: provider.approveTxSignCallback,
    };
    return mappings[type];
};

/**
 * @description Sha256 encryption
 * @param data
 * @param encoding
 * @returns {string}
 */
const sha256 = function (data, encoding = "hex") {
    return Crypto.createHash("sha256").update(data).digest(encoding);
};

/**
 * @description Sha256 twice encryption preImage create hValue
 * @param data
 * @param encoding
 * @returns {string}
 */
const sha256Twice = function (data, encoding = "hex") {
    let __tmp__ = Crypto.createHash("sha256").update(data).digest();
    return sha256(__tmp__, encoding);
};

/**
 * @description Return length 128 random string
 * @param length
 * @returns {string}
 */
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

/**
 * @description Create kofo private key and id
 * @returns {{kofoId: string, secret: string}}
 */
const createKofoId = function () {
    const bytes = secureRandom(32);
    const key = new ECKey(bytes, true);
    let kofoId = key.publicKey.toString('hex');
    let secret = key.privateKey.toString('hex');
    return {kofoId, secret};
};

const writeLog = function (label, desc, obj, up = false, path) {
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
    fs.appendFileSync(path, desc);
};

const writeMessage = function (message, path) {
    message = message + '\n\n';
    fs.appendFileSync(path, message);
};



module.exports = {
    messageType,
    signatureCallbackType,
    sha256,
    sha256Twice,
    createPreImage,
    writeLog,
    createKofoId,
    writeMessage
};