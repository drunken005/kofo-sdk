const Connection = require("../connection/connection");

class Settlement extends Connection {
    constructor(options) {
        super(options);
    }

    //refund tx signature_callback
    async createRefundTxAndHCallback(chain, hvalue, settlementId, signature = null) {
        this.print('Maker create refund tx and h callback status server', {chain, hvalue, settlementId, signature});
        return await this.post(`status/${chain}/maker/createRefundTxAndHCallback`, {
            hvalue,
            settlementId,
            signature,
        });
    }

    async receiveHAndCreateRefundCallback(chain, settlementId, signature = null) {
        this.print('Taker receive H and create refund callback status server', {chain, settlementId, signature});
        return await this.post(`status/${chain}/taker/receiveHAndCreateRefundCallback`, {
            settlementId,
            signature,
        });
    }


    //submit hash lock tx signature_callback
    async makerSubmitHashLockCallback(chain, settlementId, makerLockId, makerHashLockRawtransation, makerHashLockTransactionId, makerRefundThresholdBlockNum, makerLockExpireDate, signature = null) {
        this.print('maker submit hash lock tx callback status server', {
            chain,
            settlementId,
            makerLockId,
            makerHashLockRawtransation,
            makerHashLockTransactionId,
            makerRefundThresholdBlockNum,
            makerLockExpireDate
        });
        return await this.post(`status/${chain}/maker/submitHashLockCallback`, {
            settlementId,
            makerLockId,
            makerHashLockRawtransation,
            makerHashLockTransactionId,
            makerRefundThresholdBlockNum,
            makerLockExpireDate,
            signature,
        });
    }

    async takerSubmitHashLockCallback(chain, settlementId, takerLockId, takerHashLockRawtransation, takerHashLockTransactionId, takerRefundThresholdBlockNum, takerLockExpireDate, signature = null) {
        this.print('Taker submit hash lock callback status server', {
            chain,
            settlementId,
            takerLockId,
            takerHashLockRawtransation,
            takerHashLockTransactionId,
            takerRefundThresholdBlockNum,
            takerLockExpireDate,
            signature
        });
        return await this.post(`status/${chain}/taker/submitHashLockCallback`, {
            settlementId,
            signature,
            takerLockId,
            takerHashLockRawtransation,
            takerHashLockTransactionId,
            takerRefundThresholdBlockNum,
            takerLockExpireDate
        });
    }


    //submit withdraw tx signature_callback
    async makerSubmitWithdrawCallback(chain, makerWithdrawTransactionId, settlementId, signature = null) {
        this.print('Maker submit withdraw callback status server', {
            chain,
            makerWithdrawTransactionId,
            settlementId,
            signature
        });
        return await this.post(`/status/${chain}/maker/submitWithdrawCallback`, {
            makerWithdrawTransactionId,
            settlementId,
            signature,
        });
    }

    async takerSubmitWithdrawCallback(chain, takerWithdrawTransactionId, settlementId, signature = null) {
        this.print('Taker submit withdraw callback status server', {
            chain,
            takerWithdrawTransactionId,
            settlementId,
            signature
        });
        return await this.post(`/status/${chain}/taker/submitWithdrawCallback`, {
            takerWithdrawTransactionId,
            settlementId,
            signature,
        });
    }


    //submit refund tx signature_callback
    async makerSubmitRefundCallback(chain, settlementId, makerRefundTransactionId, signature = null) {
        this.print('Maker submit refund callback status server', {
            chain,
            settlementId,
            makerRefundTransactionId,
            signature
        });
        return await this.post(`/status/${chain}/maker/submitRefundCallback`, {
            settlementId,
            makerRefundTransactionId,
            signature,
        });
    }

    async takerSubmitRefundCallback(chain, settlementId, takerRefundTransactionId, signature = null) {
        this.print('Taker submit refund callback status server', {
            chain,
            settlementId,
            takerRefundTransactionId,
            signature
        });
        return await this.post(`/status/${chain}/taker/submitRefundCallback`, {
            settlementId,
            takerRefundTransactionId,
            signature,
        });
    }


    //submit approve tx signature_callback
    async makerSubmitApproveCallback(chain, settlementId, makerApproveTransactionId, signature = null) {
        this.print('Maker submit approve callback status server', {
            chain,
            settlementId,
            makerApproveTransactionId,
            signature
        });
        return await this.post(`/status/${chain}/maker/submitApproveCallback`, {
            settlementId,
            makerApproveTransactionId,
            signature,
        });
    }

    async takerSubmitApproveCallback(chain, settlementId, takerApproveTransactionId, signature = null) {
        this.print('Taker submit approve callback status server', {
            chain,
            settlementId,
            takerApproveTransactionId,
            signature
        });
        return await this.post(`/status/${chain}/taker/submitApproveCallback`, {
            settlementId,
            takerApproveTransactionId,
            signature,
        });
    }


    //full status signature_callback
    async makerFinalStatusCallback(chain, settlementId, signature = null) {
        this.print('Maker submit Final callback status server', {chain, settlementId, signature});
        return await this.post(`/status/${chain}/maker/finalStatusCallback`, {
            settlementId,
            signature,
        });
    }

    async takerFinalStatusCallback(chain, settlementId, signature = null) {
        this.print('Taker submit Final callback status server', {chain, settlementId, signature});
        return await this.post(`/status/${chain}/taker/finalStatusCallback`, {
            settlementId,
            signature,
        });
    }


    static provider({identifier, level, url, timeout, label, debug}) {
        return new Settlement({
            identifier,
            level,
            url,
            timeout,
            label,
            debug,
        });
    }
}

module.exports = Settlement;