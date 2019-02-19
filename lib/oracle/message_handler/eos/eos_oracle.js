const Oracle = require('../../oracle');
const {NOTICE_TYPE} = require('../../../common/constant');

/**
 * Provides EOS with Hash lock, Withdraw, Refund, Approve signature callback handler
 */
class EosOracle extends Oracle {
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
        _self.print(`EOS ${roleEnum} submitHashLockTx....................................`);
        const {hValueKey, lockTxHashKey, submitHashLockTxKey, submitHashLockTxLockerKey, settlementInfoKey, hashLockTxSignKey} = _self.keysMapping(settlementId, roleEnum);
        let settlementInfo = _self.readData(settlementInfoKey);
        let lockTxHash = _self.readData(lockTxHashKey);
        let lockTx = _self.readData(submitHashLockTxKey);
        let hvalue = _self.readData(hValueKey);
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
                        hvalue,
                        lockTime,
                        amount
                    });
                    _self.insertData(submitHashLockTxKey, lockTx);

                    //pre submit hash lock message notify
                    _statusNotice_(NOTICE_TYPE.preHashLock, {lockTx})
                }

                if (!hasLockTxHash) {
                    //hash lock transaction sign notify
                    return _self.signatureNotice({
                        type: hashLockTxSignKey,
                        chain,
                        currency,
                        publicKey: pubKey,
                        settlementId,
                        waitSign: lockTx.signHashList
                    });
                }
                const {txHash} = lockTxHash;
                //submitted hash lock message notify
                _statusNotice_(NOTICE_TYPE.submitHashLock, {lockTxHash: txHash});

                await _self.settlementProvider.submitHashLockCallback(chain, roleEnum, settlementId, lockTx.lockId, lockTx.rawTransaction, txHash, null, lockTx.nlockDate);
                _self.insertData(submitHashLockTxLockerKey, true);

                //success hash lock message notify
                _statusNotice_(NOTICE_TYPE.successHashLock, {lockTx, lockTxHash: txHash});
            } catch (err) {
                _self.insertData(submitHashLockTxLockerKey, false);
                //failed hash lock message notify
                _statusNotice_(NOTICE_TYPE.failHashLock, {lockTx, lockTxHash: lockTxHash.txHash});
                throw  err;
            }
        } else {
            _self.logger.info(`operation=return||hasLocker=${hasLocker}||flow=${submitHashLockTxLockerKey}`);
            _statusNotice_(NOTICE_TYPE.submitHashLock, {
                lockTx: lockTx,
                lockTxHash: lockTxHash ? lockTxHash.txHash : null
            });
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
        _self.print(`EOS ${roleEnum} submitWithdrawTx....................................`);
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
                    _statusNotice_(NOTICE_TYPE.preWithdraw, {withdrawTx})
                }
                if (!hasWithdrawTxHash) {
                    const {signHashList} = withdrawTx;
                    return _self.signatureNotice({
                        type: withdrawTxSignKey,
                        chain,
                        currency,
                        publicKey: pubKey,
                        settlementId,
                        waitSign: signHashList
                    });
                }
                const {txHash} = withdrawTxHash;
                //submitted withdraw tx message notify
                _statusNotice_(NOTICE_TYPE.submitWithdraw, {withdrawTx, withdrawTxHash: txHash});

                await _self.settlementProvider.submitWithdrawCallback(chain, roleEnum, txHash, settlementId);
                _self.insertData(submitWithdrawTxLockerKey, false);

                //success withdraw tx message notify
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
        } else {
            _self.logger.info(`operation=return||hasLocker=${hasLocker}||flow=${submitWithdrawTxLockerKey}`);
            //failed withdraw tx message notify
            _statusNotice_(NOTICE_TYPE.failWithdraw, {
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
        _self.print(`EOS ${roleEnum} submitRefundTx....................................`);
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
                    _statusNotice_(NOTICE_TYPE.preRefund, {refundTx})
                }
                if (!hasRefundTxHash) {
                    const {signHashList} = refundTx;
                    return _self.signatureNotice({
                        type: refundTxSignKey,
                        chain,
                        currency,
                        publicKey: pubKey,
                        settlementId,
                        waitSign: signHashList
                    });
                }
                const {txHash} = refundTxHash;
                //submitted refund tx message notify
                _statusNotice_(NOTICE_TYPE.submitRefund, {refundTx, refundTxHash: txHash});

                await _self.settlementProvider.submitRefundCallback(chain, roleEnum, settlementId, txHash);
                _self.insertData(submitRefundTxLockerKey, false);

                //success refund tx message notify
                _statusNotice_(NOTICE_TYPE.successRefund, {refundTx, refundTxHash: txHash});
            } catch (err) {
                _self.insertData(submitRefundTxLockerKey, false);

                //failed refund tx message notify
                _statusNotice_(NOTICE_TYPE.failRefund, {
                    refundTx,
                    refundTxHash: refundTxHash ? refundTxHash.txHash : null
                });
                throw  err;
            }

        } else {
            _self.logger.info(`operation=return||hasLocker=${hasLocker}||flow=${submitRefundTxLockerKey}`);
            //failed refund tx message notify
            _statusNotice_(NOTICE_TYPE.failRefund, {
                refundTx,
                refundTxHash: refundTxHash ? refundTxHash.txHash : null
            });
        }
    }
}

module.exports = EosOracle;