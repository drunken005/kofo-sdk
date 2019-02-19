const Oracle = require('../../oracle');
const {NOTICE_TYPE} = require('../../../common/constant');

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
        _self.print(`Zilliqa ${roleEnum} hashLockTxSign sign_callback params: `, {settlementId, signedRawTransaction});
        const {lockTxHashKey, submitHashLockTxKey, settlementInfoKey, submitHashLockTxLockerKey} = _self.keysMapping(settlementId, roleEnum);
        let settlementInfo = _self.readData(settlementInfoKey);
        if (!settlementInfo) {
            return _self.logger.info(`operation=return||Not read cache ${roleEnum} settlement data, flow=${settlementInfoKey}`);
        }
        const {chain, currency, amount, pubKey} = _self.formatSettlement(roleEnum, settlementInfo);
        let lockTx = _self.readData(submitHashLockTxKey);

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
            });

            const {txHash} = lockTxHash;
            //Submitted hash lock message notify
            _statusNotice_(NOTICE_TYPE.submitHashLock, {lockTxHash: txHash});

            _self.insertData(lockTxHashKey, lockTxHash);
            await _self.settlementProvider.submitHashLockCallback(chain, roleEnum, settlementId, lockId, rawTransaction, txHash, nLockNum, null);
            _self.insertData(submitHashLockTxLockerKey, false);

            //Success hash lock message notify
            _statusNotice_(NOTICE_TYPE.successHashLock, {lockTx, lockTxHash: txHash});
        } catch (err) {
            _self.insertData(submitHashLockTxLockerKey, false);

            //Failed hash lock message notify
            _statusNotice_(NOTICE_TYPE.failHashLock, {lockTx, lockTxHash: lockTxHash ? lockTxHash.txHash : null});
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
        _self.print(`ETH ${roleEnum} withdrawTxSign sign_callback params: `, {settlementId, signedRawTransaction});

        const {withdrawTxHashKey, settlementInfoKey, submitWithdrawTxKey, submitWithdrawTxLockerKey, submitHashLockTxKey} = _self.keysMapping(settlementId, roleEnum);
        const settlementInfo = _self.readData(settlementInfoKey);
        const {lockId} = _self.readData(submitHashLockTxKey);
        const withdrawTx = _self.readData(submitWithdrawTxKey);

        if (!settlementInfo) {
            return _self.logger.info(`operation=return||Not read cache ${roleEnum} settlement data, flow=${settlementInfoKey}`);
        }
        const {oppositeChain: chain, oppositeCurrency: currency, counterChainPubKey: pubKey} = _self.formatSettlement(roleEnum, settlementInfo);

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
            });
            _self.insertData(withdrawTxHashKey, withdrawTxHash);

            const {txHash} = withdrawTxHash;
            //Submitted withdraw tx message notify
            _statusNotice_(NOTICE_TYPE.submitWithdraw, {withdrawTx, withdrawTxHash: txHash});


            await _self.settlementProvider.submitWithdrawCallback(chain, roleEnum, txHash, settlementId);
            _self.insertData(submitWithdrawTxLockerKey, false);

            //Success withdraw tx message notify
            _statusNotice_(NOTICE_TYPE.successWithdraw, {withdrawTx, withdrawTxHash: txHash});
        } catch (err) {
            _self.insertData(submitWithdrawTxLockerKey, false);

            //failed withdraw tx message notify
            _statusNotice_(NOTICE_TYPE.failWithdraw, {
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
        _self.print(`Zilliqa ${roleEnum} refundTxSignCallback sign_callback params: `, {
            settlementId,
            signedRawTransaction
        });
        const {settlementInfoKey, refundTxHashKey, submitRefundTxKey, submitRefundTxLockerKey, submitHashLockTxKey} = _self.keysMapping(settlementId, roleEnum);
        const settlementInfo = _self.readData(settlementInfoKey);
        const {lockId} = _self.readData(submitHashLockTxKey);
        const refundTx = _self.readData(submitRefundTxKey);

        if (!settlementInfo) {
            return _self.logger.info(`operation=return||Not read cache ${roleEnum} settlement data, flow=${settlementInfoKey}`);
        }
        const {chain, currency, pubKey} = _self.formatSettlement(roleEnum, settlementInfo);

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
            });
            _self.insertData(refundTxHashKey, refundTxHash);

            const {txHash} = refundTxHash;
            //submitted refund tx message notify
            _statusNotice_(NOTICE_TYPE.submitRefund, {refundTx, refundTxHash: txHash});

            await _self.settlementProvider.submitRefundCallback(chain, roleEnum, settlementId, txHash);
            _self.insertData(submitRefundTxLockerKey, false);

            //success refund tx message notify
            _statusNotice_(NOTICE_TYPE.successRefund, {refundTx, refundTxHash: txHash});
        } catch (err) {
            _self.insertData(submitRefundTxLockerKey, false);

            //success refund tx message notify
            _statusNotice_(NOTICE_TYPE.failRefund, {refundTx, refundTxHash: refundTxHash ? refundTxHash.txHash : null});
            throw  err;
        }
    }
}

module.exports = ZilliqaSignatureCallback;