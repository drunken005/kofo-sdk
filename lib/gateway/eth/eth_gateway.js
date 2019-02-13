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
        this.print('ETH create hash lock tx params:', {amount, settlementId, hValue, lockTime, receiver, sender});
        return await this.post(GATEWAY_PATH.CREATE_LOCK_TX, {
            amount,
            settlementId,
            hValue,
            lockTime,
            receiver,
            sender
        });
        // return {
        //     "rawTransaction": "0x382b1ad47a28b47547382b1ad47ac3a27ddfa8",
        //     "nLockNum": 1000,//nLockNum是通过这个lockTime 计算出来的锁定的高度  比如当前是100的高度 每10秒产生一个区块 如果我填locktime=40 那锁定的时间段应该是40/10=4个区块 nLockNum = 100+4 =104
        //     "blockHeight": 10000,
        //     "lockId": "0x382b1ad47a28b47547382b1ad47ac3a27ddfa8",
        //     "gasLimit": 10000,
        //     "gasPrice": 2000,
        //     "nonce": 200
        // }
    }

    async sendLockTx({settlementId, signedRawTransaction, lockId}) {
        this.print('ETH send hash lock tx params:', {settlementId, signedRawTransaction, lockId});
        return await this.post(GATEWAY_PATH.SEND_LOCK_TX, {
            settlementId,
            signedRawTransaction,
            lockId,
        });
        // return {
        //     "txHash": "0xe931b6b1c899ca6d7e5af06b8a4656dbb195a827bc8ecca85558fb5b1726faf1"
        // }
    }

    async createWithdrawTx({settlementId, sender, lockId, preimage}) {
        this.print('ETH create withdraw tx params:', {settlementId, sender, lockId, preimage});
        return await this.post(GATEWAY_PATH.CREATE_WITHDRAW_TX, {
            settlementId,
            sender,
            lockId,
            preimage
        });
        // return {
        //     "rawTransaction": "0x382b1ad47a28b47547382b1ad47ac3a27ddfa8",
        //     "blockHeight": 10000,
        //     "gasLimit": 10000,
        //     "gasPrice": 2000,
        //     "nonce": 200
        // };
    }

    async sendWithdrawTx({settlementId, signedRawTransaction}) {
        this.print('ETH send withdraw tx params:', {settlementId, signedRawTransaction});
        return await this.post(GATEWAY_PATH.SEND_WITHDRAW_TX, {
            signedRawTransaction,
            settlementId,
        });
        // return {
        //     "txHash": "0xe931b6b1c899ca6d7e5af06b8a4656dbb195a827bc8ecca85558fb5b1726faf1"
        // }
    }

    async createRefundTx({settlementId, lockId, sender}) {
        this.print('ETH create refund tx params:', {settlementId, lockId, sender});
        return await this.post(GATEWAY_PATH.CREATE_REFUND_TX, {
            settlementId,
            lockId,
            sender
        });
        // return {
        //     "rawTransaction": "0x382b1ad47a28b47547382b1ad47ac3a27ddfa8",
        //     "blockHeight": 10000,
        //     "gasLimit": 10000,
        //     "gasPrice": 2000,
        //     "nonce": 200
        // }
    }

    async sendRefundTx({settlementId, signedRawTransaction}) {
        this.print('ETH send refund tx params:', {settlementId, signedRawTransaction});
        return await this.post(GATEWAY_PATH.SEND_REFUND_TX, {
            signedRawTransaction,
            settlementId,
        });
        // return {
        //     "txHash": "0xe931b6b1c899ca6d7e5af06b8a4656dbb195a827bc8ecca85558fb5b1726faf1"
        // }
    }

}

module.exports = EthGateway;