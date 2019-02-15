const Connection = require("../../connection/connection");
const {GATEWAY_PATH} = require("../../common/constant");

class EosGateway extends Connection {
    constructor(options) {
        super(options);
    }

    async getBalance(address) {
        return await this.post(GATEWAY_PATH.BALANCE, {
            address,
        });
    }

    async createLockTx({settlementId, sender, receiver, amount, lockTime, hvalue}) {
        this.print('EOS create hash lock tx params:', {settlementId, sender, receiver, amount, lockTime, hvalue});
        return await this.post(GATEWAY_PATH.CREATE_LOCK_TX, {
            settlementId,
            sender,
            receiver,
            amount,
            lockTime,
            hvalue,
        });
    }

    async sendLockTx({settlementId, lockId, rawTransaction, signList}) {
        this.print('EOS send hash lock tx params:', {settlementId, lockId, rawTransaction, signList});
        return await this.post(GATEWAY_PATH.SEND_LOCK_TX, {
            settlementId,
            lockId,
            rawTransaction,
            signList
        });

    }

    async createWithdrawTx({settlementId, lockId, preimage, sender}) {
        this.print('EOS create withdraw tx params:', {settlementId, lockId, preimage, sender});
        return await this.post(GATEWAY_PATH.CREATE_WITHDRAW_TX, {
            settlementId,
            lockId,
            preimage,
            sender
        });
    }

    async sendWithdrawTx({settlementId, rawTransaction, signList}) {
        this.print('EOS send withdraw tx params:', {settlementId, rawTransaction, signList});
        return await this.post(GATEWAY_PATH.SEND_WITHDRAW_TX, {
            settlementId,
            rawTransaction,
            signList
        });
    }

    async createRefundTx({settlementId, lockId, sender}) {
        this.print('EOS create refund tx params:', {settlementId, lockId, sender});
        return await this.post(GATEWAY_PATH.CREATE_REFUND_TX, {
            settlementId,
            lockId,
            sender
        });
    }

    async sendRefundTx({settlementId, rawTransaction, signList}) {
        this.print('EOS send refund tx params:', {settlementId, rawTransaction, signList});
        return await this.post(GATEWAY_PATH.SEND_REFUND_TX, {
            settlementId,
            rawTransaction,
            signList
        });
    }
}

module.exports = EosGateway;