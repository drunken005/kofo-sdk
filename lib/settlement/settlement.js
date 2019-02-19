const Connection = require("../connection/connection");

/**
 * State server callback handler
 */
class Settlement extends Connection {
    constructor(options) {
        super(options);
    }

    /**
     * @description Maker refund tx sign_callback
     * @param chain   Maker block chain name
     * @param hvalue  Maker h value
     * @param settlementId Settlement order id
     * @param signature  Post signature
     * @returns {Promise<*>}
     */
    async createRefundTxAndHCallback(chain, hvalue, settlementId, signature = null) {
        return await this.post(`status/${chain}/maker/createRefundTxAndHCallback`, {
            hvalue,
            settlementId,
            signature,
        });
    }

    /**
     * @description Taker receive h and create refund callback
     * @param chain  Taker block chain name
     * @param settlementId  Settlement order id
     * @param signature  Post signature
     * @returns {Promise<*>}
     */
    async receiveHAndCreateRefundCallback(chain, settlementId, signature = null) {
        return await this.post(`status/${chain}/taker/receiveHAndCreateRefundCallback`, {
            settlementId,
            signature,
        });
    }

    /**
     * @description Submit hash lock tx sign_callback
     * @param chain  RoleEnum block name
     * @param roleEnum Value[ Maker | TAKER ]
     * @param settlementId Settlement order id
     * @param lockId RoleEnum lock id
     * @param hashLockRawtransation Hash lock raw transaction
     * @param hashLockTransactionId  Hash lock transaction hash
     * @param refundThresholdBlockNum Refund threshold block number
     * @param lockExpireDate  Lock expire date (s)
     * @param signature  Post signature
     * @returns {Promise<*>}
     */
    async submitHashLockCallback(chain, roleEnum, settlementId, lockId, hashLockRawtransation, hashLockTransactionId, refundThresholdBlockNum, lockExpireDate, signature = null) {
        roleEnum = roleEnum.toLowerCase();
        let data = {settlementId, signature};
        data[roleEnum + 'LockId'] = lockId;
        data[roleEnum + 'HashLockRawtransation'] = hashLockRawtransation;
        data[roleEnum + 'HashLockTransactionId'] = hashLockTransactionId;
        data[roleEnum + 'RefundThresholdBlockNum'] = refundThresholdBlockNum;
        data[roleEnum + 'LockExpireDate'] = lockExpireDate;
        return await this.post(`status/${chain}/${roleEnum}/submitHashLockCallback`, data);
    }

    /**
     * @description Submit withdraw tx sign_callback
     * @param chain  RoleEnum block chain name
     * @param roleEnum Value[ Maker | TAKER ]
     * @param withdrawTransactionId Withdraw transaction hash
     * @param settlementId Settlement order id
     * @param signature Post signature
     * @returns {Promise<*>}
     */
    async submitWithdrawCallback(chain, roleEnum, withdrawTransactionId, settlementId, signature = null) {
        roleEnum = roleEnum.toLowerCase();
        let data = {settlementId, signature};
        data[roleEnum + 'WithdrawTransactionId'] = withdrawTransactionId;
        return await this.post(`/status/${chain}/${roleEnum}/submitWithdrawCallback`, data);
    }

    /**
     * @description Submit refund tx sign_callback
     * @param chain RoleEnum block chain name
     * @param roleEnum  Value[ Maker | TAKER ]
     * @param settlementId Settlement order id
     * @param refundTransactionId Refund transaction hash
     * @param signature Post signature
     * @returns {Promise<*>}
     */
    async submitRefundCallback(chain, roleEnum, settlementId, refundTransactionId, signature = null) {
        roleEnum = roleEnum.toLowerCase();
        let data = {settlementId, signature};
        data[roleEnum + 'RefundTransactionId'] = refundTransactionId;
        return await this.post(`/status/${chain}/${roleEnum}/submitRefundCallback`, data);
    }

    /**
     * @description submit approve tx sign_callback
     * @param chain  RoleEnum block chain name
     * @param roleEnum Value MAKER|TAKER
     * @param settlementId  Settlement order id
     * @param approveTransactionId  Approve transaction hash
     * @param signature  Post signature
     * @returns {Promise<*>}
     */
    async submitApproveCallback(chain, roleEnum, settlementId, approveTransactionId, signature = null) {
        roleEnum = roleEnum.toLowerCase();
        let data = {settlementId, signature};
        data[roleEnum + 'ApproveTransactionId'] = approveTransactionId;
        return await this.post(`/status/${chain}/${roleEnum}/submitApproveCallback`, data);
    }

    /**
     * @description Final status callback
     * @param chain
     * @param roleEnum MAKER|TAKER
     * @param settlementId Settlement order id
     * @param signature
     * @returns {Promise<*>}
     */
    async finalStatusCallback(chain, roleEnum, settlementId, signature = null) {
        roleEnum = roleEnum.toLowerCase();
        return await this.post(`/status/${chain}/${roleEnum}/finalStatusCallback`, {
            settlementId,
            signature,
        });
    }

    /**
     * @description init settlement provider
     * @param identifier
     * @param level
     * @param url
     * @param timeout
     * @param label
     * @param debug
     * @param logPath
     * @returns {Settlement}
     */
    static provider({identifier, level, url, timeout, label}) {
        return new Settlement({
            identifier,
            level,
            url,
            timeout,
            label
        });
    }
}

module.exports = Settlement;