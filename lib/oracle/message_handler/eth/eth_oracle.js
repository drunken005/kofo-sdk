const Oracle = require('../../oracle');
const {NOTICE_TYPE} = require('../../../common/constant');

/**
 * Provides ETH and Erc20 settlement order message handler
 */
class EthOracle extends Oracle {
    constructor() {
        let args = Array.prototype.slice.apply(arguments);
        super(...args);
    }

    /**
     * @description  Maker and Taker receive hash lock message and submit hash lock transaction handler
     * @param message Mqtt send message
     * @returns {Promise<*>}
     */
    async submitHashLockTxHandler(message) {
        const {settlementId, roleEnum} = message;
        const _self = this;
        _self.logger.info(`ETH ${roleEnum} submitHashLockTx ${settlementId}`);
        const {hValueKey, lockTxHashKey, submitHashLockTxKey, submitHashLockTxLockerKey, settlementInfoKey, hashLockTxSignKey} = _self.keysMapping(settlementId, roleEnum);
        let settlementInfo = _self.readData(settlementInfoKey);
        let lockTxHash = _self.readData(lockTxHashKey);
        let lockTx = _self.readData(submitHashLockTxKey);
        let hValue = _self.readData(hValueKey);
        let hasLockTx = !!lockTx;
        let hasLockTxHash = !!lockTxHash;
        if (!settlementInfo) {
            return _self.logger.info(`operation=return||flow=${submitHashLockTxLockerKey}`);
        }
        const {chain, currency, amount, pubKey, lockTime, oppositeCounterChainPubKey} = _self.formatSettlement(roleEnum, settlementInfo);

        const _statusNotice_ = function (type, extra) {
            let msg = {settlementId, roleEnum, chain, currency, amount, pubKey};
            _self.statusNotice(type, Object.assign(msg, extra));
        };

        const locker = _self.readData(submitHashLockTxLockerKey);
        const hasLocker = !!locker;
        if (!hasLocker) {
            try {
                _self.insertData(submitHashLockTxLockerKey, true);
                const gatewayProvider = _self.getGatewayProvider(chain, currency);
                if (!hasLockTx) {
                    const sender = _self.publicToAddress(chain, currency, pubKey);
                    const receiver = _self.publicToAddress(chain, currency, oppositeCounterChainPubKey);
                    lockTx = await gatewayProvider.createLockTx({
                        settlementId,
                        sender,
                        receiver,
                        hValue,
                        lockTime,
                        amount
                    });
                    _self.insertData(submitHashLockTxKey, lockTx);

                    //pre submit hash lock message notify
                    _statusNotice_(NOTICE_TYPE.PRE_HASH_LOCK, {lockTx})
                }

                const {lockId, rawTransaction, nLockNum} = lockTx;
                if (!hasLockTxHash) {
                    //hash lock transaction sign notify
                    return _self.signatureNotice({
                        type: hashLockTxSignKey,
                        chain,
                        currency,
                        publicKey: pubKey,
                        settlementId,
                        rawTransaction
                    });
                }
                const {txHash} = lockTxHash;

                //submitted hash lock message notify
                _statusNotice_(NOTICE_TYPE.SUBMIT_HASH_LOCK, {lockTxHash: txHash});

                await _self.settlementProvider.submitHashLockCallback(chain, roleEnum, settlementId, lockId, rawTransaction, txHash, nLockNum, null);
                _self.insertData(submitHashLockTxLockerKey, true);

                //success hash lock message notify
                _statusNotice_(NOTICE_TYPE.SUCCESS_HASH_LOCK, {lockTx, lockTxHash: txHash});
            } catch (err) {
                _self.insertData(submitHashLockTxLockerKey, false);
                //failed hash lock message notify
                _statusNotice_(NOTICE_TYPE.FAIL_HASH_LOCK, {lockTx, lockTxHash: lockTxHash ? lockTxHash.txHash : null});
                throw  err;
            }
        } else {
            _self.logger.info(`operation=return||hasLocker=${hasLocker}||flow=${submitHashLockTxLockerKey}`);
            _statusNotice_(NOTICE_TYPE.SUBMIT_HASH_LOCK, {lockTx, lockTxHash: lockTxHash ? lockTxHash.txHash : null});
        }
    }

    /**
     * @description  Maker and Taker receive withdraw message and submit withdraw transaction handler
     * @param message Mqtt send message
     * @returns {Promise<*>}
     */
    async submitWithdrawTxHandler(message) {
        const _self = this;
        let {settlementId, preimage, roleEnum, chain, currency} = message;
        _self.logger.info(`ETH ${roleEnum} submitWithdrawTx ${settlementId}`);
        const {preImageKey, withdrawTxHashKey, submitWithdrawTxKey, submitHashLockTxKey, settlementInfoKey, submitWithdrawTxLockerKey, withdrawTxSignKey} = _self.keysMapping(settlementId, roleEnum);

        const lockId = message[`${roleEnum === 'MAKER' ? 'taker' : 'maker'}LockId`];

        const withdrawTxHash = _self.readData(withdrawTxHashKey);
        let withdrawTx = _self.readData(submitWithdrawTxKey);

        const lockTx = _self.readData(submitHashLockTxKey);
        const settlementInfo = _self.readData(settlementInfoKey);
        const hasWithdrawTx = !!withdrawTx;
        const hasWithdrawTxHash = !!withdrawTxHash;

        if (!lockTx || !settlementInfo) {
            return _self.logger.info(`operation=return||hasLockTx=${!lockTx}||hasSettlementInfo=${!settlementInfo}||flow=${submitWithdrawTxLockerKey}`);
        }
        const {counterChainPubKey: pubKey} = _self.formatSettlement(roleEnum, settlementInfo);

        const _statusNotice_ = function (type, extra) {
            let msg = {settlementId, roleEnum, chain, currency, lockId, pubKey};
            _self.statusNotice(type, Object.assign(msg, extra));
        };

        let locker = _self.readData(submitWithdrawTxLockerKey);
        let hasLocker = !!locker;
        if (!hasLocker) {
            try {
                _self.insertData(submitWithdrawTxLockerKey, true);
                let gatewayProvider = _self.getGatewayProvider(chain, currency);
                let sender = _self.publicToAddress(chain, currency, pubKey);
                if (!hasWithdrawTx) {
                    if (roleEnum === 'MAKER') {
                        preimage = _self.readData(preImageKey);
                    }
                    withdrawTx = await gatewayProvider.createWithdrawTx({
                        settlementId,
                        sender,
                        lockId,
                        preimage
                    });
                    _self.insertData(submitWithdrawTxKey, withdrawTx);

                    //pre withdraw tx message notify
                    _statusNotice_(NOTICE_TYPE.PRE_WITHDRAW, {withdrawTx})
                }
                if (!hasWithdrawTxHash) {
                    const {rawTransaction} = withdrawTx;
                    return _self.signatureNotice({
                        type: withdrawTxSignKey,
                        chain,
                        currency,
                        publicKey: pubKey,
                        settlementId,
                        rawTransaction
                    });
                }
                const {txHash} = withdrawTxHash;
                //submitted withdraw tx message notify
                _statusNotice_(NOTICE_TYPE.SUBMIT_WITHDRAW, {withdrawTx, withdrawTxHash: txHash});

                await _self.settlementProvider.submitWithdrawCallback(chain, roleEnum, txHash, settlementId);
                _self.insertData(submitWithdrawTxLockerKey, false);

                //success withdraw tx message notify
                _statusNotice_(NOTICE_TYPE.SUCCESS_WITHDRAW, {withdrawTx, withdrawTxHash: txHash});
            } catch (err) {
                _self.insertData(submitWithdrawTxLockerKey, false);

                //failed withdraw tx message notify
                _statusNotice_(NOTICE_TYPE.FAIL_WITHDRAW, {
                    withdrawTx,
                    withdrawTxHash: withdrawTxHash ? withdrawTxHash.txHash : null
                });
                throw  err;
            }
        } else {
            _self.logger.info(`operation=return||hasLocker=${hasLocker}||flow=${submitWithdrawTxLockerKey}`);
            //failed withdraw tx message notify
            _statusNotice_(NOTICE_TYPE.FAIL_WITHDRAW, {
                withdrawTx,
                withdrawTxHash: withdrawTxHash ? withdrawTxHash.txHash : null
            });
        }
    }

    /**
     * @description  Maker and Taker receive refund message and submit refund transaction handler
     * @param message Mqtt send message
     * @returns {Promise<*>}
     */
    async submitRefundTxHandler(message) {
        const _self = this;
        let {settlementId, roleEnum} = message;
        _self.logger.info(`ETH ${roleEnum} submitRefundTx ${settlementId}`);
        const {settlementInfoKey, refundTxHashKey, submitRefundTxKey, submitRefundTxLockerKey, refundTxSignKey} = _self.keysMapping(settlementId, roleEnum);

        const refundTxHash = _self.readData(refundTxHashKey);
        let refundTx = _self.readData(submitRefundTxKey);
        const settlementInfo = _self.readData(settlementInfoKey);
        const lockId = message[`${roleEnum.toLowerCase()}LockId`];

        const hashRefundTx = !!refundTx;
        const hasRefundTxHash = !!refundTxHash;

        if (!settlementInfo) {
            _self.logger.info(`operation=return||hasHashLockTx=${!settlementInfo}||flow=${submitRefundTxLockerKey}`);
            return;
        }

        const {chain, currency, pubKey} = _self.formatSettlement(roleEnum, settlementInfo);
        const _statusNotice_ = function (type, extra) {
            let msg = {settlementId, roleEnum, chain, currency, lockId, pubKey};
            _self.statusNotice(type, Object.assign(msg, extra));
        };

        let locker = _self.readData(submitRefundTxLockerKey);
        let hasLocker = !!locker;
        if (!hasLocker) {
            try {
                _self.insertData(submitRefundTxLockerKey, true);
                const gatewayProvider = _self.getGatewayProvider(chain, currency);
                const sender = _self.publicToAddress(chain, currency, pubKey);
                if (!hashRefundTx) {
                    refundTx = await gatewayProvider.createRefundTx({
                        settlementId,
                        sender,
                        lockId
                    });
                    _self.insertData(submitRefundTxKey, refundTx);

                    //pre refund tx message notify
                    _statusNotice_(NOTICE_TYPE.PRE_REFUND, {refundTx})
                }
                if (!hasRefundTxHash) {
                    const {rawTransaction} = refundTx;
                    return _self.signatureNotice({
                        type: refundTxSignKey,
                        chain,
                        currency,
                        publicKey: pubKey,
                        settlementId,
                        rawTransaction
                    });
                }
                const {txHash} = refundTxHash;
                //submitted refund tx message notify
                _statusNotice_(NOTICE_TYPE.SUBMIT_REFUND, {refundTx, refundTxHash: txHash});

                await _self.settlementProvider.submitRefundCallback(chain, roleEnum, settlementId, txHash);
                _self.insertData(submitRefundTxLockerKey, false);

                //success refund tx message notify
                _statusNotice_(NOTICE_TYPE.SUCCESS_REFUND, {refundTx, refundTxHash: txHash});
            } catch (err) {
                _self.insertData(submitRefundTxLockerKey, false);

                //failed refund tx message notify
                _statusNotice_(NOTICE_TYPE.FAIL_REFUND, {
                    refundTx,
                    refundTxHash: refundTxHash ? refundTxHash.txHash : null
                });
                throw  err;
            }

        } else {
            _self.logger.info(`operation=return||hasLocker=${hasLocker}||flow=${submitRefundTxLockerKey}`);
            //failed refund tx message notify
            _statusNotice_(NOTICE_TYPE.FAIL_REFUND, {
                refundTx,
                refundTxHash: refundTxHash ? refundTxHash.txHash : null
            });
        }
    }

    /**
     * @description  Maker and Taker receive approve message and submit approve transaction handler
     * @param message Mqtt send message
     * @returns {Promise<*>}
     */
    async submitApproveTxHandler(message) {
        const {settlementId, roleEnum} = message;
        const _self = this;
        _self.logger.info(`ETH Erc20 ${roleEnum} submitApproveTx ${settlementId}`);

        const {settlementInfoKey, approveTxHashKey, submitApproveTxKey, submitApproveTxLockerKey, approveTxSignKey} = _self.keysMapping(settlementId, roleEnum);
        const settlementInfo = _self.readData(settlementInfoKey);
        const approveTxHash = _self.readData(approveTxHashKey);
        let approveTx = _self.readData(submitApproveTxKey);
        const hasApproveTx = !!approveTx;
        const hasApproveTxHash = !!approveTxHash;
        if (!settlementInfo) {
            return _self.logger.info(`operation=return|| not read cache settlement data flow=${settlementInfoKey}`);
        }
        const {chain, currency, pubKey, amount} = _self.formatSettlement(roleEnum, settlementInfo);
        const _statusNotice_ = function (type, extra) {
            let msg = {settlementId, roleEnum, chain, currency, pubKey};
            _self.statusNotice(type, Object.assign(msg, extra));
        };
        const locker = _self.readData(submitApproveTxLockerKey);
        const hasLocker = !!locker;
        if (!hasLocker) {
            try {
                _self.insertData(submitApproveTxLockerKey, true);
                const gatewayProvider = _self.getGatewayProvider(chain, currency);
                if (!hasApproveTx) {
                    const sender = _self.publicToAddress(chain, currency, pubKey);
                    approveTx = await gatewayProvider.createApproveTx({
                        settlementId,
                        sender,
                        amount
                    });
                    _self.insertData(submitApproveTxKey, approveTx);

                    //pre approve tx message notify
                    _statusNotice_(NOTICE_TYPE.PRE_APPROVE, {approveTx})
                }

                if (!hasApproveTxHash) {
                    const {rawTransaction} = approveTx;
                    return _self.signatureNotice({
                        type: approveTxSignKey,
                        chain,
                        currency,
                        publicKey: pubKey,
                        settlementId,
                        rawTransaction
                    });
                }
                const {txHash} = approveTxHash;
                //submitted approve tx message notify
                _statusNotice_(NOTICE_TYPE.SUBMIT_APPROVE, {approveTx, approveTxHash: txHash});

                await _self.settlementProvider.submitApproveCallback(chain, roleEnum, settlementId, txHash);
                _self.insertData(submitApproveTxLockerKey, false);

                //success approve tx message notify
                _statusNotice_(NOTICE_TYPE.SUCCESS_APPROVE, {approveTx, approveTxHash: txHash});
            } catch (err) {
                _self.insertData(submitApproveTxLockerKey, false);
                //failed approve tx message notify
                _statusNotice_(NOTICE_TYPE.FAIL_APPROVE, {
                    approveTx,
                    approveTxHash: approveTxHash ? approveTxHash.txHash : null
                });
                throw  err;
            }
        } else {
            _self.logger.info(`operation=return||hasLocker=${hasLocker}||flow=${submitApproveTxLockerKey}`);
            //failed approve tx message notify
            _statusNotice_(NOTICE_TYPE.FAIL_APPROVE, {
                approveTx,
                approveTxHash: approveTxHash ? approveTxHash.txHash : null
            });
        }
    }
}

module.exports = EthOracle;