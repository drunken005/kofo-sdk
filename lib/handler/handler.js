const {MQ_MESSAGE_TYPE, CONNECTION, LOGGER} = require('../common/constant');
const _ = require('lodash');

// const kkkks = [
//     'create_refund_tx_and_h',
//     'receive_h_and_create_refund_tx',
//     'submit_hash_lock_tx',
//     'submit_withdraw_tx',
//     'submit_refund_tx',
//     'submit_approve_tx',
//     'preimage',
//     'hvalue',
//     'public_key',
//     'counter_chain_public_key',
//     'lock_tx_hash',
//     'withdraw_tx_hash',
//     'refund_tx_hash',
//     'approve_tx_hash',
//     'locker']


class MessageHandler {

    makerKeysMapping(settlementId) {
        return {
            keyMakerCreateRefundTxAndH: [settlementId, MQ_MESSAGE_TYPE.makerCreateRefundTxAndH].join('_'),
            keyMakerCreateRefundTxAndHLocker: [settlementId, MQ_MESSAGE_TYPE.makerCreateRefundTxAndH, MQ_MESSAGE_TYPE.locker].join('_'),
            keyMakerPreImage: [settlementId, MQ_MESSAGE_TYPE.makerPreImage].join('_'),
            keyMakerHValue: [settlementId, MQ_MESSAGE_TYPE.makerHValue].join('_'),

            keyMakerLockTxHash: [settlementId, MQ_MESSAGE_TYPE.makerLockTxHash].join('_'),
            keyMakerSubmitHashLockTx: [settlementId, MQ_MESSAGE_TYPE.makerSubmitHashLockTx].join('_'),
            keyMakerSubmitHashLockTxLocker: [settlementId, MQ_MESSAGE_TYPE.makerSubmitHashLockTx, MQ_MESSAGE_TYPE.locker].join('_'),

            keyMakerWithdrawTxHash: [settlementId, MQ_MESSAGE_TYPE.makerWithdrawTxHash].join('_'),
            keyMakerSubmitWithdrawTx: [settlementId, MQ_MESSAGE_TYPE.makerSubmitWithdrawTx].join('_'),
            keyMakerSubmitWithdrawTxLocker: [settlementId, MQ_MESSAGE_TYPE.makerSubmitWithdrawTx, MQ_MESSAGE_TYPE.locker].join('_'),

            keyMakerRefundTxHash: [settlementId, MQ_MESSAGE_TYPE.makerRefundTxHash].join('_'),
            keyMakerSubmitRefundTx: [settlementId, MQ_MESSAGE_TYPE.makerSubmitRefundTx].join('_'),
            keyMakerSubmitRefundTxLocker: [settlementId, MQ_MESSAGE_TYPE.makerSubmitRefundTx, MQ_MESSAGE_TYPE.locker].join('_'),

            keyMakerApproveTxHash: [settlementId, MQ_MESSAGE_TYPE.makerApproveTxHash].join('_'),
            keyMakerSubmitApproveTx: [settlementId, MQ_MESSAGE_TYPE.makerSubmitApproveTx],
            keyMakerSubmitApproveTxLocker: [settlementId, MQ_MESSAGE_TYPE.makerSubmitApproveTx, MQ_MESSAGE_TYPE.locker].join('_'),

        };
    }

    takerKeysMapping(settlementId) {
        return {
            keyTakerReceiveHAndCreateRefundTx: [settlementId, MQ_MESSAGE_TYPE.takerReceiveHAndCreateRefundTx].join('_'),
            keyTakerReceiveHAndCreateRefundTxLocker: [settlementId, MQ_MESSAGE_TYPE.takerReceiveHAndCreateRefundTx, MQ_MESSAGE_TYPE.locker].join('_'),
            keyTakerHValue: [settlementId, MQ_MESSAGE_TYPE.takerHValue].join('_'),

            keyTakerLockTxHash: [settlementId, MQ_MESSAGE_TYPE.takerLockTxHash].join('_'),
            keyTakerSubmitHashLockTx: [settlementId, MQ_MESSAGE_TYPE.takerSubmitHashLockTx].join('_'),
            keyTakerSubmitHashLockTxLocker: [settlementId, MQ_MESSAGE_TYPE.takerSubmitHashLockTx, MQ_MESSAGE_TYPE.locker].join('_'),

            keyTakerWithdrawTxHash: [settlementId, MQ_MESSAGE_TYPE.takerWithdrawTxHash].join('_'),
            keyTakerSubmitWithdrawTx: [settlementId, MQ_MESSAGE_TYPE.takerSubmitWithdrawTx].join('_'),
            keyTakerSubmitWithdrawTxLocker: [settlementId, MQ_MESSAGE_TYPE.takerSubmitWithdrawTx, MQ_MESSAGE_TYPE.locker].join('_'),

            keyTakerRefundTxHash: [settlementId, MQ_MESSAGE_TYPE.takerRefundTxHash].join('_'),
            keyTakerSubmitRefundTx: [settlementId, MQ_MESSAGE_TYPE.takerSubmitRefundTx].join('_'),
            keyTakerSubmitRefundTxLocker: [settlementId, MQ_MESSAGE_TYPE.takerSubmitRefundTx, MQ_MESSAGE_TYPE.locker].join('_'),

            keyTakerApproveTxHash: [settlementId, MQ_MESSAGE_TYPE.takerApproveTxHash].join('_'),
            keyTakerSubmitApproveTx: [settlementId, MQ_MESSAGE_TYPE.takerSubmitApproveTx],
            keyTakerSubmitApproveTxLocker: [settlementId, MQ_MESSAGE_TYPE.takerSubmitApproveTx, MQ_MESSAGE_TYPE.locker].join('_'),


        };
    }
}

module.exports = MessageHandler;