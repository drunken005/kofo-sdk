const Oracle = require('../../oracle');
const {NOTICE_TYPE} = require('../../../common/constant');
const {cacheKeysMapping} = require('../../../mapping/mapping');

/**
 * Provides Zilliqa settlement order message handler
 */
class ZilliqaOracle extends Oracle {
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
        _self.logger.info(`Zilliqa ${roleEnum} submitHashLockTx ${settlementId}`);
        const {hValueKey, lockTxHashKey, submitHashLockTxKey, submitHashLockTxLockerKey, settlementInfoKey, hashLockTxSignKey} = cacheKeysMapping(settlementId, roleEnum);
        let settlementInfo = await await _self.readData(settlementInfoKey);
        let lockTxHash = await _self.readData(lockTxHashKey);
        let lockTx = await _self.readData(submitHashLockTxKey);
        let hValue = await _self.readData(hValueKey);
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

        const locker = await _self.readData(submitHashLockTxLockerKey);
        const hasLocker = !!locker;
        if (!hasLocker) {
            try {
                await _self.insertData(submitHashLockTxLockerKey, false);
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
                    await _self.insertData(submitHashLockTxKey, lockTx);

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

                //success hash lock message notify
                _statusNotice_(NOTICE_TYPE.SUCCESS_HASH_LOCK, {lockTx, lockTxHash: txHash});
                await _self.insertData(submitHashLockTxLockerKey, true);
            } catch (err) {
                await _self.insertData(submitHashLockTxLockerKey, false);
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
        _self.logger.info(`Zilliqa ${roleEnum} submitWithdrawTx ${settlementId}`);
        const {preImageKey, withdrawTxHashKey, submitWithdrawTxKey, submitHashLockTxKey, settlementInfoKey, submitWithdrawTxLockerKey, withdrawTxSignKey} = cacheKeysMapping(settlementId, roleEnum);

        const lockId = message[`${roleEnum === 'MAKER' ? 'taker' : 'maker'}LockId`];

        const withdrawTxHash = await _self.readData(withdrawTxHashKey);
        let withdrawTx = await _self.readData(submitWithdrawTxKey);

        const lockTx = await _self.readData(submitHashLockTxKey);
        const settlementInfo = await _self.readData(settlementInfoKey);
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

        let locker = await _self.readData(submitWithdrawTxLockerKey);
        let hasLocker = !!locker;
        if (!hasLocker) {
            try {
                await _self.insertData(submitWithdrawTxLockerKey, false);
                let gatewayProvider = _self.getGatewayProvider(chain, currency);
                let sender = _self.publicToAddress(chain, currency, pubKey);
                if (!hasWithdrawTx) {
                    if (roleEnum === 'MAKER') {
                        preimage = await _self.readData(preImageKey);
                    }
                    withdrawTx = await gatewayProvider.createWithdrawTx({
                        settlementId,
                        sender,
                        lockId,
                        preimage
                    });
                    await _self.insertData(submitWithdrawTxKey, withdrawTx);

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

                //success withdraw tx message notify
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

        const {settlementInfoKey, refundTxHashKey, submitRefundTxKey, submitRefundTxLockerKey, refundTxSignKey} = cacheKeysMapping(settlementId, roleEnum);

        const refundTxHash = await _self.readData(refundTxHashKey);
        let refundTx = await _self.readData(submitRefundTxKey);
        const settlementInfo = await _self.readData(settlementInfoKey);
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

        let locker = await _self.readData(submitRefundTxLockerKey);
        let hasLocker = !!locker;
        if (!hasLocker) {
            try {
                await _self.insertData(submitRefundTxLockerKey, false);
                const gatewayProvider = _self.getGatewayProvider(chain, currency);
                const sender = _self.publicToAddress(chain, currency, pubKey);
                if (!hashRefundTx) {
                    refundTx = await gatewayProvider.createRefundTx({
                        settlementId,
                        sender,
                        lockId
                    });
                    await _self.insertData(submitRefundTxKey, refundTx);

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

                //success refund tx message notify
                _statusNotice_(NOTICE_TYPE.SUCCESS_REFUND, {refundTx, refundTxHash: txHash});
                await _self.insertData(submitRefundTxLockerKey, true);
            } catch (err) {
                await _self.insertData(submitRefundTxLockerKey, false);

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
}

module.exports = ZilliqaOracle;