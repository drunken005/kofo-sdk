const Oracle = require('../../oracle');
const {NOTICE_TYPE} = require('../../../common/constant');
const {cacheKeysMapping} = require('../../../mapping/mapping');

/**
 * Provides Zilliqa with Hash lock, Withdraw, Refund, Approve signature callback handler
 */
class ZilliqaSignatureCallback extends Oracle {

    constructor() {
        let args = Array.prototype.slice.apply(arguments);
        super(...args);
    }

    /**
     * @description  Maker and Taker submit hash lock transaction signature callback handler
     * @param roleEnum MAKER | TAKER
     * @param settlementId Settlement order Id
     * @param signedRawTransaction Transaction signed returned hash
     * @returns {Promise<void | never>}
     */
    async hashLockTxSignCallback(roleEnum, settlementId, signedRawTransaction) {
        const _self = this;
        _self.logger.info(`Zilliqa ${roleEnum} ${settlementId} hashLockTxSign sign_callback params: `, signedRawTransaction);
        const {lockTxHashKey, submitHashLockTxKey, settlementInfoKey, submitHashLockTxLockerKey} = cacheKeysMapping(settlementId, roleEnum);
        let settlementInfo = await _self.readData(settlementInfoKey);
        if (!settlementInfo) {
            return _self.logger.info(`operation=return||Not read cache ${roleEnum} settlement data, flow=${settlementInfoKey}`);
        }
        const {chain, currency, amount, pubKey, confirmThreshold} = _self.formatSettlement(roleEnum, settlementInfo);
        let lockTx = await _self.readData(submitHashLockTxKey);

        const _statusNotice_ = function (type, extra) {
            let msg = {settlementId, roleEnum, chain, currency, amount, pubKey};
            _self.statusNotice(type, Object.assign(msg, extra));
        };

        let lockTxHash;
        try {
            const {lockId, rawTransaction, nLockNum} = lockTx;
            const gatewayProvider = _self.getGatewayProvider(chain, currency);
            lockTxHash = await gatewayProvider.sendLockTx({
                settlementId,
                signedRawTransaction,
                lockId,
                confirmThreshold
            });

            const {txHash} = lockTxHash;
            //Submitted hash lock message notify
            _statusNotice_(NOTICE_TYPE.SUBMIT_HASH_LOCK, {lockTxHash: txHash});

            await _self.insertData(lockTxHashKey, lockTxHash);
            await _self.settlementProvider.submitHashLockCallback(chain, roleEnum, settlementId, lockId, rawTransaction, txHash, nLockNum, null);

            //Success hash lock message notify
            _statusNotice_(NOTICE_TYPE.SUCCESS_HASH_LOCK, {lockTx, lockTxHash: txHash});
            await _self.insertData(submitHashLockTxLockerKey, true);
        } catch (err) {
            await _self.insertData(submitHashLockTxLockerKey, false);

            //Failed hash lock message notify
            _statusNotice_(NOTICE_TYPE.FAIL_HASH_LOCK, {lockTx, lockTxHash: lockTxHash ? lockTxHash.txHash : null});
            throw  err;
        }

    }

    /**
     * @description  Maker and Taker submit withdraw transaction signature callback handler
     * @param roleEnum MAKER | TAKER
     * @param settlementId Settlement order Id
     * @param signedRawTransaction Transaction signed returned hash
     * @returns {Promise<void | never>}
     */
    async withdrawTxSignCallback(roleEnum, settlementId, signedRawTransaction) {
        const _self = this;
        _self.logger.info(`Zilliqa ${roleEnum} ${settlementId} withdrawTxSign sign_callback params: `, signedRawTransaction);

        const {withdrawTxHashKey, settlementInfoKey, submitWithdrawTxKey, submitWithdrawTxLockerKey, submitHashLockTxKey} = cacheKeysMapping(settlementId, roleEnum);
        const settlementInfo = await _self.readData(settlementInfoKey);
        const {lockId} = await _self.readData(submitHashLockTxKey);
        const withdrawTx = await _self.readData(submitWithdrawTxKey);

        if (!settlementInfo) {
            return _self.logger.info(`operation=return||Not read cache ${roleEnum} settlement data, flow=${settlementInfoKey}`);
        }
        const {oppositeChain: chain, oppositeCurrency: currency, counterChainPubKey: pubKey, oppositeConfirmThreshold: confirmThreshold} = _self.formatSettlement(roleEnum, settlementInfo);

        const _statusNotice_ = function (type, extra) {
            let msg = {settlementId, roleEnum, chain, currency, lockId, pubKey};
            _self.statusNotice(type, Object.assign(msg, extra));
        };

        let withdrawTxHash;
        try {
            const gatewayProvider = _self.getGatewayProvider(chain, currency);
            withdrawTxHash = await gatewayProvider.sendWithdrawTx({
                signedRawTransaction,
                settlementId,
                confirmThreshold
            });
            await _self.insertData(withdrawTxHashKey, withdrawTxHash);

            const {txHash} = withdrawTxHash;
            //Submitted withdraw tx message notify
            _statusNotice_(NOTICE_TYPE.SUBMIT_WITHDRAW, {withdrawTx, withdrawTxHash: txHash});


            await _self.settlementProvider.submitWithdrawCallback(chain, roleEnum, txHash, settlementId);

            //Success withdraw tx message notify
            _statusNotice_(NOTICE_TYPE.SUCCESS_WITHDRAW, {withdrawTx, withdrawTxHash: txHash});
            await _self.insertData(submitWithdrawTxLockerKey, true);
        } catch (err) {
            await _self.insertData(submitWithdrawTxLockerKey, false);

            //failed withdraw tx message notify
            _statusNotice_(NOTICE_TYPE.FAIL_WITHDRAW, {
                withdrawTx,
                withdrawTxHash: withdrawTxHash ? withdrawTxHash.txHash : null
            });
            throw  err;
        }
    }

    /**
     * @description  Maker and Taker submit refund transaction signature callback handler
     * @param roleEnum MAKER | TAKER
     * @param settlementId Settlement order Id
     * @param signedRawTransaction Transaction signed returned hash
     * @returns {Promise<void | never>}
     */
    async refundTxSignCallback(roleEnum, settlementId, signedRawTransaction) {
        const _self = this;
        _self.logger.info(`Zilliqa ${roleEnum} ${settlementId}refundTxSignCallback sign_callback params: `, signedRawTransaction);
        const {settlementInfoKey, refundTxHashKey, submitRefundTxKey, submitRefundTxLockerKey, submitHashLockTxKey} = cacheKeysMapping(settlementId, roleEnum);
        const settlementInfo = await _self.readData(settlementInfoKey);
        const {lockId} = await _self.readData(submitHashLockTxKey);
        const refundTx = await _self.readData(submitRefundTxKey);

        if (!settlementInfo) {
            return _self.logger.info(`operation=return||Not read cache ${roleEnum} settlement data, flow=${settlementInfoKey}`);
        }
        const {chain, currency, pubKey, confirmThreshold} = _self.formatSettlement(roleEnum, settlementInfo);

        const _statusNotice_ = function (type, extra) {
            let msg = {settlementId, roleEnum, chain, currency, lockId, pubKey};
            _self.statusNotice(type, Object.assign(msg, extra));
        };
        let refundTxHash;
        try {
            const gatewayProvider = _self.getGatewayProvider(chain, currency);
            refundTxHash = await gatewayProvider.sendRefundTx({
                signedRawTransaction,
                settlementId,
                confirmThreshold
            });
            await _self.insertData(refundTxHashKey, refundTxHash);

            const {txHash} = refundTxHash;
            //submitted refund tx message notify
            _statusNotice_(NOTICE_TYPE.SUBMIT_REFUND, {refundTx, refundTxHash: txHash});

            await _self.settlementProvider.submitRefundCallback(chain, roleEnum, settlementId, txHash);

            //success refund tx message notify
            _statusNotice_(NOTICE_TYPE.SUCCESS_REFUND, {refundTx, refundTxHash: txHash});
            await _self.insertData(submitRefundTxLockerKey, true);
        } catch (err) {
            await _self.insertData(submitRefundTxLockerKey, false);

            //success refund tx message notify
            _statusNotice_(NOTICE_TYPE.FAIL_REFUND, {
                refundTx,
                refundTxHash: refundTxHash ? refundTxHash.txHash : null
            });
            throw  err;
        }
    }
}

module.exports = ZilliqaSignatureCallback;