const {SIGN_CALLBACK_TYPE, MESSAGE_STORAGE_KEYS} = require('../common/constant');
const Crypto = require("crypto");
const ECKey = require('eckey');
const secureRandom = require('secure-random');
const CryptoJS = require("crypto-js");
const _ = require('lodash');

/**
 * @description Mqtt message handler method mappings
 * @param type
 * @param provider
 * @returns {*}
 */
const messageType = function (type, provider) {
    type = type.split('_').slice(1).join('_');
    let mappings = {
        [MESSAGE_STORAGE_KEYS.CREATE_REFUND_TX_AND_H]: provider.createRefundHandler,
        [MESSAGE_STORAGE_KEYS.RECEIVE_H_AND_CREATE_REFUND_TX]: provider.createRefundHandler,
        [MESSAGE_STORAGE_KEYS.SUBMIT_HASH_LOCK_TX]: provider.submitHashLockTxHandler,
        [MESSAGE_STORAGE_KEYS.SUBMIT_WITHDRAW_TX]: provider.submitWithdrawTxHandler,
        [MESSAGE_STORAGE_KEYS.SUBMIT_REFUND_TX]: provider.submitRefundTxHandler,
        [MESSAGE_STORAGE_KEYS.SUBMIT_APPROVE_TX]: provider.submitApproveTxHandler,
        [MESSAGE_STORAGE_KEYS.FINAL_STATUS_NOTIFY]: provider.finalStatusHandler
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
        [SIGN_CALLBACK_TYPE.HASH_LOCK_TX_SIGN]: provider.hashLockTxSignCallback,
        [SIGN_CALLBACK_TYPE.WITHDRAW_TX_SIGN]: provider.withdrawTxSignCallback,
        [SIGN_CALLBACK_TYPE.REFUND_TX_SIGN]: provider.refundTxSignCallback,
        [SIGN_CALLBACK_TYPE.APPROVE_TX_SIGN]: provider.approveTxSignCallback,
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


const encrypt = function (data, secret) {
    if (!secret) {
        throw new Error('Encrypt data secret is null');
    }
    if (_.isObject(data)) {
        data = JSON.stringify(data)
    }
    return CryptoJS.AES.encrypt(data, secret).toString();
};

const decrypt = function (data, secret) {
    if (!secret) {
        throw new Error('Decrypt data secret is null');
    }
    return CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8)
};


module.exports = {
    messageType,
    signatureCallbackType,
    sha256,
    sha256Twice,
    createPreImage,
    createKofoId,
    encrypt,
    decrypt
};