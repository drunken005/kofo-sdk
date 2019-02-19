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
     * @param label  Debug log label
     */
    constructor(event, config, label) {
        config = _.pick(config, ['insertData', 'readData', 'gateway', 'settlement', 'debug', 'network', 'logPath']);
        this.config = config;
        this.event = event;
        this.logger = Logger.getLogger();
        this.label = label;
        this.settlementProvider = Settlement.provider({
            url: config.settlement,
            timeout: CONNECTION.TIMEOUT,
            level: LOGGER.LEVEL,
            label: "Settlement",
            debug: config.debug,
            logPath: config.logPath
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
                _self.insertData(createRefundTxAndHLockerKey, true);
                if (!hasHValue) {
                    if (roleEnum === 'MAKER') {
                        let preImage = Utils.createPreImage();
                        hValue = Utils.sha256Twice(preImage);
                        _self.print('hValue: ', {hValue}, true);
                        _self.insertData(preImageKey, preImage);
                    }
                    _self.insertData(hValueKey, hValue);

                }
                roleEnum === 'TAKER' && _self.insertData(hValueKey, hValue);
                !settlementInfo && _self.insertData(settlementInfoKey, message);

                if (roleEnum === 'MAKER') {
                    await _self.settlementProvider.createRefundTxAndHCallback(message.chain, hValue, settlementId);
                } else {
                    await this.settlementProvider.receiveHAndCreateRefundCallback(message.chain, settlementId);
                }
                _self.insertData(createRefundTxAndHLockerKey, false);
                _self.statusNotice(NOTICE_TYPE.settlementInfo, message);
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

        const {txCompleteKey, } = _self.keysMapping(settlementId, roleEnum);
        await this.settlementProvider.finalStatusCallback(chain, roleEnum, settlementId);
        _self.insertData(txCompleteKey, true);
        _self.statusNotice(NOTICE_TYPE.complete, {settlementId, roleEnum, chain, currency})
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
            settlementInfo,
            createRefundTxAndH,
            preImage,
            hValue,
            lockTxHash,
            submitHashLockTx,
            withdrawTxHash,
            submitWithdrawTx,
            refundTxHash,
            submitRefundTx,
            approveTxHash,
            submitApproveTx,
            txComplete,
            locker
        } = MESSAGE_STORAGE_KEYS;

        return {
            settlementInfoKey: [settlementId, roleEnum, settlementInfo].join('_'),
            createRefundTxAndHLockerKey: [settlementId, roleEnum, createRefundTxAndH, locker].join('_'),
            preImageKey: [settlementId, roleEnum, preImage].join('_'),
            hValueKey: [settlementId, roleEnum, hValue].join('_'),

            lockTxHashKey: [settlementId, roleEnum, lockTxHash].join('_'),
            submitHashLockTxKey: [settlementId, roleEnum, submitHashLockTx].join('_'),
            submitHashLockTxLockerKey: [settlementId, roleEnum, submitHashLockTx, locker].join('_'),

            withdrawTxHashKey: [settlementId, roleEnum, withdrawTxHash].join('_'),
            submitWithdrawTxKey: [settlementId, roleEnum, submitWithdrawTx].join('_'),
            submitWithdrawTxLockerKey: [settlementId, roleEnum, submitWithdrawTx, locker].join('_'),

            refundTxHashKey: [settlementId, roleEnum, refundTxHash].join('_'),
            submitRefundTxKey: [settlementId, roleEnum, submitRefundTx].join('_'),
            submitRefundTxLockerKey: [settlementId, roleEnum, submitRefundTx, locker].join('_'),

            approveTxHashKey: [settlementId, roleEnum, approveTxHash].join('_'),
            submitApproveTxKey: [settlementId, roleEnum, submitApproveTx].join('_'),
            submitApproveTxLockerKey: [settlementId, roleEnum, submitApproveTx, locker].join('_'),

            txCompleteKey: [settlementId, roleEnum, txComplete].join('_'),

            hashLockTxSignKey: [roleEnum, SIGN_CALLBACK_TYPE.hashLockTxSign].join('_'),
            withdrawTxSignKey: [roleEnum, SIGN_CALLBACK_TYPE.withdrawTxSign].join('_'),
            refundTxSignKey: [roleEnum, SIGN_CALLBACK_TYPE.refundTxSign].join('_'),
            approveTxSignKey: [roleEnum, SIGN_CALLBACK_TYPE.approveTxSign].join('_')
        }
    }

    /**
     * @description Maker and Taker transaction each status notification unified handling
     * @param type Event status type
     * @param message Notification message
     */
    statusNotice(type, message) {
        this.event.emit(KOFO_EVENT_TYPE.statusNotice, _.assign(message, {type}))
    }

    /**
     * @description  Maker and Taker before sending the transaction, the notification client signature will be processed uniformly
     * @param message Notification sign message
     */
    signatureNotice(message) {
        this.event.emit(KOFO_EVENT_TYPE.signatureNotice, message)
    }

    /**
     * @description Gateway provider
     * @param chain Block chain name
     * @param currency Transaction currency
     */
    getGatewayProvider(chain, currency) {
        const {gateway, debug, logPath} = this.config;
        return GatewayProvider.init(chain, currency, debug, gateway, CONNECTION.TIMEOUT, LOGGER.LEVEL, logPath);
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
        return this.config.readData(key);
    }

    /**
     * @description Storage data to client
     * @param key
     * @param value
     * @returns {*|void}
     */
    insertData(key, value) {
        return this.config.insertData(key, value);
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

    print(desc, obj, up = false) {
        let str = desc;
        if (!this.config.debug) {
            return;
        }
        desc = '【' + _.toUpper(this.label) + '】' + desc;
        if (up) {
            console.log(_.toUpper(desc));
        } else {
            console.log(desc);
        }
        if (obj && !_.isEmpty(obj)) {
            console.table([obj]);
        }
        console.log('\n');
        Utils.writeLog(this.label, str, obj, up, this.config.logPath);
    }
}

module.exports = Oracle;