const Connection = require("../../connection/connection");
const {GATEWAY_PATH} = require("../../common/constant");

class EthGateway extends Connection {
    constructor(options) {
        super(options);
    }

    async getBalance(address) {
        return await this.post(GATEWAY_PATH.BALANCE, {
            address,
        });
    }

    async createLockTx({amount, settlementId, hValue, lockTime, receiver, sender}) {
        return await this.post(GATEWAY_PATH.CREATE_LOCK_TX, {
            amount,
            settlementId,
            hValue,
            lockTime,
            receiver,
            sender
        });
    }

    async sendLockTx({settlementId, signedRawTransaction, lockId}) {
        return await this.post(GATEWAY_PATH.SEND_LOCK_TX, {
            settlementId,
            signedRawTransaction,
            lockId,
        });
    }

    async createWithdrawTx({settlementId, sender, lockId, preimage}) {
        return await this.post(GATEWAY_PATH.CREATE_WITHDRAW_TX, {
            settlementId,
            sender,
            lockId,
            preimage
        });
    }

    async sendWithdrawTx({settlementId, signedRawTransaction}) {
        return await this.post(GATEWAY_PATH.SEND_WITHDRAW_TX, {
            signedRawTransaction,
            settlementId,
        });
    }

    async createRefundTx({settlementId, lockId, sender}) {
        return await this.post(GATEWAY_PATH.CREATE_REFUND_TX, {
            settlementId,
            lockId,
            sender
        });
    }

    async sendRefundTx({settlementId, signedRawTransaction}) {
        return await this.post(GATEWAY_PATH.SEND_REFUND_TX, {
            signedRawTransaction,
            settlementId,
        });
    }

    async createApproveTx({sender, amount, settlementId}) {
        return await this.post(GATEWAY_PATH.CREATE_APPROVE_TX, {
            sender,
            amount,
            settlementId
        });
    }

    async sendApproveTx({settlementId, signedRawTransaction}) {
        return await this.post(GATEWAY_PATH.SEND_APPROVE_TX, {
            settlementId,
            signedRawTransaction
        });
    }

}

module.exports = EthGateway;