const {SIGN_CALLBACK_TYPE, MESSAGE_STORAGE_KEYS} = require('../common/constant');
/**
 * @description Mqtt message handler method mappings
 * @param type
 * @param provider
 * @returns {*}
 */
const messageHandlerMapping = function (type, provider) {
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
const signatureCallbackMapping = function (type, provider) {
    let mappings = {
        [SIGN_CALLBACK_TYPE.HASH_LOCK_TX_SIGN]: provider.hashLockTxSignCallback,
        [SIGN_CALLBACK_TYPE.WITHDRAW_TX_SIGN]: provider.withdrawTxSignCallback,
        [SIGN_CALLBACK_TYPE.REFUND_TX_SIGN]: provider.refundTxSignCallback,
        [SIGN_CALLBACK_TYPE.APPROVE_TX_SIGN]: provider.approveTxSignCallback,
    };
    return mappings[type];
};

/**
 * @description Storage data key
 * @param settlementId Settlement order id
 * @param roleEnum MAKER||TAKER
 * @returns {{
 *              submitHashLockTxLockerKey: string,
 *              submitWithdrawTxLockerKey: string,
 *              withdrawTxSignKey: string,
 *              refundTxSignKey: string,
 *              refundTxHashKey: string,
 *              txCompleteKey: string,
 *              submitRefundTxLockerKey: string,
 *              submitWithdrawTxKey: string,
 *              hValueKey: string,
 *              approveTxSignKey: string,
 *              withdrawTxHashKey: string,
 *              hashLockTxSignKey: string,
 *              settlementInfoKey: string,
 *              submitApproveTxLockerKey: string,
 *              submitHashLockTxKey: string,
 *              preImageKey: string,
 *              createRefundTxAndHLockerKey: string,
 *              lockTxHashKey: string,
 *              approveTxHashKey: string,
 *              submitApproveTxKey: string,
 *              submitRefundTxKey: string
 *          }}
 */
const cacheKeysMapping = function (settlementId, roleEnum) {
    roleEnum = roleEnum.toLowerCase();
    const {
        SETTLEMENT_INFO,
        CREATE_REFUND_TX_AND_H,
        PRE_IMAGE,
        H_VALUE,
        SUBMIT_HASH_LOCK_TX,
        LOCK_TX_HASH,
        SUBMIT_WITHDRAW_TX,
        WITHDRAW_TX_HASH,
        SUBMIT_REFUND_TX,
        REFUND_TX_HASH,
        SUBMIT_APPROVE_TX,
        APPROVE_TX_HASH,
        TX_COMPLETE,
        LOCKER

    } = MESSAGE_STORAGE_KEYS;

    return {
        settlementInfoKey: [settlementId, roleEnum, SETTLEMENT_INFO].join('_'),
        createRefundTxAndHLockerKey: [settlementId, roleEnum, CREATE_REFUND_TX_AND_H, LOCKER].join('_'),
        preImageKey: [settlementId, roleEnum, PRE_IMAGE].join('_'),
        hValueKey: [settlementId, roleEnum, H_VALUE].join('_'),

        lockTxHashKey: [settlementId, roleEnum, LOCK_TX_HASH].join('_'),
        submitHashLockTxKey: [settlementId, roleEnum, SUBMIT_HASH_LOCK_TX].join('_'),
        submitHashLockTxLockerKey: [settlementId, roleEnum, SUBMIT_HASH_LOCK_TX, LOCKER].join('_'),

        withdrawTxHashKey: [settlementId, roleEnum, WITHDRAW_TX_HASH].join('_'),
        submitWithdrawTxKey: [settlementId, roleEnum, SUBMIT_WITHDRAW_TX].join('_'),
        submitWithdrawTxLockerKey: [settlementId, roleEnum, SUBMIT_WITHDRAW_TX, LOCKER].join('_'),

        refundTxHashKey: [settlementId, roleEnum, REFUND_TX_HASH].join('_'),
        submitRefundTxKey: [settlementId, roleEnum, SUBMIT_REFUND_TX].join('_'),
        submitRefundTxLockerKey: [settlementId, roleEnum, SUBMIT_REFUND_TX, LOCKER].join('_'),

        approveTxHashKey: [settlementId, roleEnum, APPROVE_TX_HASH].join('_'),
        submitApproveTxKey: [settlementId, roleEnum, SUBMIT_APPROVE_TX].join('_'),
        submitApproveTxLockerKey: [settlementId, roleEnum, SUBMIT_APPROVE_TX, LOCKER].join('_'),

        txCompleteKey: [settlementId, roleEnum, TX_COMPLETE].join('_'),

        hashLockTxSignKey: [roleEnum, SIGN_CALLBACK_TYPE.HASH_LOCK_TX_SIGN].join('_'),
        withdrawTxSignKey: [roleEnum, SIGN_CALLBACK_TYPE.WITHDRAW_TX_SIGN].join('_'),
        refundTxSignKey: [roleEnum, SIGN_CALLBACK_TYPE.REFUND_TX_SIGN].join('_'),
        approveTxSignKey: [roleEnum, SIGN_CALLBACK_TYPE.APPROVE_TX_SIGN].join('_')
    }
};


module.exports = {messageHandlerMapping, signatureCallbackMapping, cacheKeysMapping};