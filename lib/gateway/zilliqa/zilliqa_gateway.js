const Connection = require("../../connection/connection");
const {GATEWAY_PATH} = require("../../common/constant");


class ZilliqaGateway extends Connection {
    constructor(options) {
        super(options);
    }


    async getBalance(address) {
        return await this.post(GATEWAY_PATH.BALANCE, {
            address,
        });
    }

    async createLockTx({amount, settlementId, hValue, lockTime, receiver, sender}) {
        this.print('Zilliqa create hash lock tx params:', {amount, settlementId, hValue, lockTime, receiver, sender});
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
        this.print('Zilliqa send hash lock tx params:', {settlementId, signedRawTransaction, lockId});
        return await this.post(GATEWAY_PATH.SEND_LOCK_TX, {
            settlementId,
            signedRawTransaction,
            lockId,
        });
    }

    async createWithdrawTx({settlementId, sender, lockId, preimage}) {
        this.print('ETH create withdraw tx params:', {settlementId, sender, lockId, preimage});
        return await this.post(GATEWAY_PATH.CREATE_WITHDRAW_TX, {
            settlementId,
            sender,
            lockId,
            preimage
        });
    }

    async sendWithdrawTx({settlementId, signedRawTransaction}) {
        this.print('Zilliqa send withdraw tx params:', {settlementId, signedRawTransaction});
        return await this.post(GATEWAY_PATH.SEND_WITHDRAW_TX, {
            signedRawTransaction,
            settlementId,
        });
    }

    async createRefundTx({settlementId, lockId, sender}) {
        this.print('Zilliqa create refund tx params:', {settlementId, lockId, sender});
        return await this.post(GATEWAY_PATH.CREATE_REFUND_TX, {
            settlementId,
            lockId,
            sender
        });
    }

    async sendRefundTx({settlementId, signedRawTransaction}) {
        this.print('Zilliqa send refund tx params:', {settlementId, signedRawTransaction});
        return await this.post(GATEWAY_PATH.SEND_REFUND_TX, {
            signedRawTransaction,
            settlementId,
        });

    }

}

module.exports = ZilliqaGateway;