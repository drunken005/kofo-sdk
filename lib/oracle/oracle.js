const Logger = require('../logger/logger');
const {CONNECTION, LOGGER, KOFO_EVENT_TYPE, MESSAGE_STORAGE_KEYS, NOTICE_TYPE, SIGN_CALLBACK_TYPE} = require('../common/constant');
const Utils = require('../utils/utils');
const GatewayProvider = require('../gateway/provider');
const ChainProvider = require('../blockchain/provider');
const Settlement = require('../settlement/settlement');
const _ = require('lodash');

/**
 * Provides receive mqtt message and handler
 * Provides transaction signature callback handler
 * Provides gateway proxy
 * provides status server proxy
 * Provides at different chain  public key convert to address proxy
 */
class Oracle {

    /**
     * @description Message handler and transaction signed callback constructor
     * @param event SDK to client message event emitter
     * @param config Including gateway, state server and other configuration
     * @param cacheMap  Cache data map
     */
    constructor(event, config, cacheMap) {
        config = _.pick(config, ['insertData', 'readData', 'gateway', 'settlement', 'debug', 'network', 'logPath', 'mqOptions']);
        this.kofoId = Utils.sha256(config.mqOptions.kofoId);
        this.config = config;
        this.event = event;
        this.cacheMap = cacheMap;
        this.logger = Logger.getLogger();
        this.settlementProvider = Settlement.provider({
            url: config.settlement,
            timeout: CONNECTION.TIMEOUT,
            level: LOGGER.LEVEL,
            label: "Settlement"
        })
    }

    /**
     * @description Receive Mqtt push settlement order info and Taker or Maker storage message and create or save h value
     * @param message Taker or Maker settlement order message
     * @returns {Promise<void>}
     */
    async createRefundHandler(message) {
        let {settlementId, hValue, roleEnum} = message;
        const _self = this;
        const {settlementInfoKey, createRefundTxAndHLockerKey, preImageKey, hValueKey} = _self.keysMapping(settlementId, roleEnum);
        let hasLocker = !!_self.readData(createRefundTxAndHLockerKey);
        let settlementInfo = _self.readData(settlementInfoKey);
        let hasHValue = !!hValue;
        if (!hasLocker) {
            try {
                _self.insertData(createRefundTxAndHLockerKey, false);
                if (!hasHValue) {
                    if (roleEnum === 'MAKER') {
                        let preImage = Utils.createPreImage();
                        hValue = Utils.sha256Twice(preImage);
                        _self.insertData(preImageKey, preImage);
                    }
                    _self.insertData(hValueKey, hValue);

                }
                roleEnum === 'TAKER' && _self.insertData(hValueKey, hValue);
                !settlementInfo && _self.insertData(settlementInfoKey, message);

                if (roleEnum === 'MAKER') {
                    await _self.settlementProvider.createRefundTxAndHCallback(message.chain, hValue, settlementId);
                } else {
                    await _self.settlementProvider.receiveHAndCreateRefundCallback(message.chain, settlementId);
                }
                _self.insertData(createRefundTxAndHLockerKey, true);
                _self.statusNotice(NOTICE_TYPE.SETTLEMENT_INFO, message);
            } catch (err) {
                _self.insertData(createRefundTxAndHLockerKey, false);
                throw  err;
            }
        } else {
            this.logger.info(`operation=return||hasLocker=${hasLocker}||flow=${createRefundTxAndHLockerKey}`);
        }
    }

    /**
     * @description Taker and Maker transaction final message handler
     * @param message settlement order message
     * @returns {Promise<void>}
     */
    async finalStatusHandler(message) {
        const _self = this;
        const {settlementId, roleEnum, chain, currency} = message;
        const {txCompleteKey,} = _self.keysMapping(settlementId, roleEnum);
        await this.settlementProvider.finalStatusCallback(chain, roleEnum, settlementId);
        _self.insertData(txCompleteKey, true);
        _self.statusNotice(NOTICE_TYPE.COMPLETE, {settlementId, roleEnum, chain, currency})
        _self.cacheMap.clear();
    }

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
    keysMapping(settlementId, roleEnum) {
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
    }

    /**
     * @description Maker and Taker transaction each status notification unified handling
     * @param type Event status type
     * @param message Notification message
     */
    statusNotice(type, message) {
        this.event.emit(KOFO_EVENT_TYPE.STATUS_NOTICE, _.assign(message, {type}))
    }

    /**
     * @description  Maker and Taker before sending the transaction, the notification client signature will be processed uniformly
     * @param message Notification sign message
     */
    signatureNotice(message) {
        this.event.emit(KOFO_EVENT_TYPE.SIGNATURE_NOTICE, message)
    }

    /**
     * @description Gateway provider
     * @param chain Block chain name
     * @param currency Transaction currency
     */
    getGatewayProvider(chain, currency) {
        const {gateway} = this.config;
        return GatewayProvider.init(chain, currency, gateway, CONNECTION.TIMEOUT, LOGGER.LEVEL);
    }

    /**
     * @description Returns the address based on the public key provided
     * @param chain Block chain name
     * @param currency Transaction currency
     * @param publicKey  Public key
     * @returns {*|Buffer}
     */
    publicToAddress(chain, currency, publicKey) {
        const provider = ChainProvider.init(chain, currency);
        const {network} = this.config;
        return provider.publicToAddress(publicKey, network);
    }

    /**
     * @description Read client storage data by key
     * @param key
     * @returns {*}
     */
    readData(key) {
        const self = this;
        let data = self.cacheMap.get(key) || this.config.readData(key);
        if (data === undefined || _.isBoolean(data)) {
            return data;
        }
        data = Utils.decrypt(data, Utils.sha256Twice([key, self.kofoId].join('_')));
        try {
            data = JSON.parse(data);
        } catch (e) {
            return data;
        }
        return data;
    }

    /**
     * @description Storage data to client
     * @param key
     * @param value
     * @returns {*|void}
     */
    insertData(key, value) {
        const self = this;
        const data = _.isBoolean(value) ? value : Utils.encrypt(value, Utils.sha256Twice([key, self.kofoId].join('_')));
        self.cacheMap.set(key, data);
        self.config.insertData(key, data);
    }

    /**
     * @description Format cache settlement order data by roleEnum
     * @param roleEnum
     * @param settlementData
     */
    formatSettlement(roleEnum, settlementData) {
        roleEnum = roleEnum.toLowerCase();
        let opposite = roleEnum === 'maker' ? 'taker' : 'maker';
        const fields = ['Amount', 'Chain', 'CounterChainPubKey', 'Currency', 'Locktime', 'PubKey'];

        let docs = {};
        fields.forEach((key) => {
            docs[_.lowerFirst(key)] = settlementData[roleEnum + key];
        });
        docs.lockTime = docs.locktime;

        fields.forEach((key) => {
            docs['opposite' + key] = settlementData[opposite + key];
        });
        docs.oppositeLockTime = docs.oppositeLocktime;
        return _.omit(docs, 'locktime', 'oppositeLocktime');
    }

}

module.exports = Oracle;