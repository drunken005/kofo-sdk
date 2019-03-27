const Connection = require("../../connection/connection");
const {GATEWAY_PATH, CONFIRM_THRESHOLD} = require("../../common/constant");

class BosGateway extends Connection {
    constructor(options) {
        super(options);
    }

    async getBalance(address) {
        return await this.post(GATEWAY_PATH.BALANCE, {
            address,
        });
    }

    async createLockTx({settlementId, sender, receiver, amount, lockTime, hvalue}) {
        return await this.post(GATEWAY_PATH.CREATE_LOCK_TX, {
            settlementId,
            sender,
            receiver,
            amount,
            lockTime,
            hvalue,
        });
    }

    async sendLockTx({settlementId, lockId, rawTransaction, signList, confirmThreshold = CONFIRM_THRESHOLD.BOS}) {
        return await this.post(GATEWAY_PATH.SEND_LOCK_TX, {
            settlementId,
            lockId,
            rawTransaction,
            signList,
            confirmThreshold
        });

    }

    async createWithdrawTx({settlementId, lockId, preimage, sender}) {
        return await this.post(GATEWAY_PATH.CREATE_WITHDRAW_TX, {
            settlementId,
            lockId,
            preimage,
            sender
        });
    }

    async sendWithdrawTx({settlementId, rawTransaction, signList, confirmThreshold = CONFIRM_THRESHOLD.BOS}) {
        return await this.post(GATEWAY_PATH.SEND_WITHDRAW_TX, {
            settlementId,
            rawTransaction,
            signList,
            confirmThreshold
        });
    }

    async createRefundTx({settlementId, lockId, sender}) {
        return await this.post(GATEWAY_PATH.CREATE_REFUND_TX, {
            settlementId,
            lockId,
            sender
        });
    }

    async sendRefundTx({settlementId, rawTransaction, signList, confirmThreshold = CONFIRM_THRESHOLD.BOS}) {
        return await this.post(GATEWAY_PATH.SEND_REFUND_TX, {
            settlementId,
            rawTransaction,
            signList,
            confirmThreshold
        });
    }
}

module.exports = BosGateway;