const Logger = require('../logger/logger');
const _ = require('lodash');
const {CONNECTION, LOGGER, KOFO_EVENT_TYPE, NOTICE_TYPE} = require('../common/constant');
const Utils = require('../utils/utils');
const {cacheKeysMapping} = require('../mapping/mapping');
const GatewayProvider = require('../gateway/provider');
const ChainProvider = require('../blockchain/provider');
const Settlement = require('../settlement/settlement');

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
        config = _.pick(config, ['insertData', 'readData', 'gateway', 'settlement', 'network', 'mqOptions', 'cacheEncrypt']);
        if (!config.hasOwnProperty('cacheEncrypt')) {
            config.cacheEncrypt = true;
        }
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
        const {settlementInfoKey, createRefundTxAndHLockerKey, preImageKey, hValueKey} = cacheKeysMapping(settlementId, roleEnum);
        let hasLocker = !!await _self.readData(createRefundTxAndHLockerKey);
        let settlementInfo = await _self.readData(settlementInfoKey);
        let hasHValue = !!hValue;
        if (!hasLocker) {
            try {
                await _self.insertData(createRefundTxAndHLockerKey, false);
                if (!hasHValue) {
                    if (roleEnum === 'MAKER') {
                        let preImage = Utils.createPreImage();
                        hValue = Utils.sha256Twice(preImage);
                        await _self.insertData(preImageKey, preImage);
                    }
                    await _self.insertData(hValueKey, hValue);

                }
                roleEnum === 'TAKER' && await _self.insertData(hValueKey, hValue);
                !settlementInfo && await _self.insertData(settlementInfoKey, message);

                if (roleEnum === 'MAKER') {
                    await _self.settlementProvider.createRefundTxAndHCallback(message.chain, hValue, settlementId);
                } else {
                    await _self.settlementProvider.receiveHAndCreateRefundCallback(message.chain, settlementId);
                }
                await _self.insertData(createRefundTxAndHLockerKey, true);
                _self.statusNotice(NOTICE_TYPE.SETTLEMENT_INFO, message);
            } catch (err) {
                await _self.insertData(createRefundTxAndHLockerKey, false);
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
        const {txCompleteKey} = cacheKeysMapping(settlementId, roleEnum);
        await this.settlementProvider.finalStatusCallback(chain, roleEnum, settlementId);
        await _self.insertData(txCompleteKey, true);
        _self.statusNotice(NOTICE_TYPE.COMPLETE, {settlementId, roleEnum, chain, currency})
        _self.cacheMap.clear();
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
    async readData(key) {
        const self = this;
        let data = self.cacheMap.get(key) || await this.config.readData(key);
        if (data === undefined || _.isBoolean(data) || data === null) {
            return data;
        }
        if (self.config.cacheEncrypt) {
            data = Utils.decrypt(data, Utils.sha256Twice([key, self.kofoId].join('_')));
            try {
                data = JSON.parse(data);
            } catch (e) {
                return data;
            }
            return data;
        } else {
            return data;
        }
    }

    /**
     * @description Storage data to client
     * @param key
     * @param value
     * @returns {*|void}
     */
    async insertData(key, value) {
        const self = this;
        let data;
        if (!self.config.cacheEncrypt || _.isBoolean(value) || value === null || value === undefined) {
            data = value;
        } else {
            data = Utils.encrypt(value, Utils.sha256Twice([key, self.kofoId].join('_')));
        }
        self.cacheMap.set(key, data);
        await self.config.insertData(key, data);
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