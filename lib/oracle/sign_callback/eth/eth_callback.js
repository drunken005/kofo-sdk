const Oracle = require('../../oracle');
const {NOTICE_TYPE} = require('../../../common/constant');

/**
 * Provides ETH and Erc20 with Hash lock, Withdraw, Refund, Approve signature callback handler
 */
class EthSignatureCallback extends Oracle {

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
        _self.logger.info(`ETH ${roleEnum} ${settlementId} hashLockTxSign sign_callback params: `, signedRawTransaction);
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
            _statusNotice_(NOTICE_TYPE.SUBMIT_HASH_LOCK, {lockTx, lockTxHash: txHash});

            _self.insertData(lockTxHashKey, lockTxHash);
            await _self.settlementProvider.submitHashLockCallback(chain, roleEnum, settlementId, lockId, rawTransaction, txHash, nLockNum, null);

            //Success hash lock message notify
            _statusNotice_(NOTICE_TYPE.SUCCESS_HASH_LOCK, {lockTx, lockTxHash: txHash});
            _self.insertData(submitHashLockTxLockerKey, true);
        } catch (err) {
            _self.insertData(submitHashLockTxLockerKey, false);

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
        _self.logger.info(`ETH ${roleEnum} ${settlementId} withdrawTxSign sign_callback params: `, signedRawTransaction);

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
            _statusNotice_(NOTICE_TYPE.SUBMIT_WITHDRAW, {withdrawTx, withdrawTxHash: txHash});


            await _self.settlementProvider.submitWithdrawCallback(chain, roleEnum, txHash, settlementId);

            //Success withdraw tx message notify
            _statusNotice_(NOTICE_TYPE.SUCCESS_WITHDRAW, {withdrawTx, withdrawTxHash: txHash});
            _self.insertData(submitWithdrawTxLockerKey, true);
        } catch (err) {
            _self.insertData(submitWithdrawTxLockerKey, false);

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
        _self.logger.info(`ETH ${roleEnum} ${settlementId} refundTxSignCallback sign_callback params: `, signedRawTransaction);
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
            _statusNotice_(NOTICE_TYPE.SUBMIT_REFUND, {refundTx, refundTxHash: txHash});

            await _self.settlementProvider.submitRefundCallback(chain, roleEnum, settlementId, txHash);

            //success refund tx message notify
            _statusNotice_(NOTICE_TYPE.SUCCESS_REFUND, {refundTx, refundTxHash: txHash});
            _self.insertData(submitRefundTxLockerKey, true);
        } catch (err) {
            _self.insertData(submitRefundTxLockerKey, false);

            //success refund tx message notify
            _statusNotice_(NOTICE_TYPE.FAIL_REFUND, {refundTx, refundTxHash: refundTxHash ? refundTxHash.txHash : null});
            throw  err;
        }
    }

    /**
     * @description  Maker and Taker submit approve transaction signature callback handler
     * @param roleEnum MAKER | TAKER
     * @param settlementId Settlement order Id
     * @param signedRawTransaction Transaction signed returned hash
     * @returns {Promise<void | never>}
     */
    async approveTxSignCallback(roleEnum, settlementId, signedRawTransaction) {
        const _self = this;
        _self.logger.info(`ETH Erc20 ${roleEnum} ${settlementId} approveTxSignCallback sign_callback params: `, signedRawTransaction);
        const {settlementInfoKey, approveTxHashKey, submitApproveTxKey, submitApproveTxLockerKey} = _self.keysMapping(settlementId, roleEnum);
        const settlementInfo = _self.readData(settlementInfoKey);
        const approveTx = _self.readData(submitApproveTxKey);

        if (!settlementInfo) {
            return _self.logger.info(`operation=return||Not read cache ${roleEnum} settlement data, flow=${settlementInfoKey}`);
        }
        const {chain, currency, pubKey} = _self.formatSettlement(roleEnum, settlementInfo);

        const _statusNotice_ = function (type, extra) {
            let msg = {settlementId, roleEnum, chain, currency, pubKey};
            _self.statusNotice(type, Object.assign(msg, extra));
        };

        let approveTxHash;
        try {
            const gatewayProvider = _self.getGatewayProvider(chain, currency);
            approveTxHash = await gatewayProvider.sendApproveTx({
                signedRawTransaction,
                settlementId,
            });
            _self.insertData(approveTxHashKey, approveTxHash);

            const {txHash} = approveTxHash;
            //submitted approve tx message notify
            _statusNotice_(NOTICE_TYPE.SUBMIT_APPROVE, {approveTx, approveTxHash: txHash});

            await _self.settlementProvider.submitApproveCallback(chain, roleEnum, settlementId, txHash);

            //success approve tx message notify
            _statusNotice_(NOTICE_TYPE.SUCCESS_APPROVE, {approveTx, approveTxHash: txHash});
            _self.insertData(submitApproveTxLockerKey, true);
        } catch (err) {
            //failed approve tx message notify
            _statusNotice_(NOTICE_TYPE.FAIL_APPROVE, {
                approveTx,
                approveTxHash: approveTxHash ? approveTxHash.txHash : null
            });

            _self.insertData(submitApproveTxLockerKey, false);
            throw  err;
        }
    }
}

module.exports = EthSignatureCallback;