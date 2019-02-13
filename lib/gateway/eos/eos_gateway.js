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

    async createLockTx({settlementId, sender, receiver, amount, lockTime, hValue}) {
        this.print('EOS create hash lock tx params:', {settlementId, sender, receiver, amount, lockTime, hValue});
        // return await this.post(GATEWAY_PATH.CREATE_LOCK_TX, {
        //     settlementId,
        //     sender,
        //     receiver,
        //     amount,
        //     lockTime,
        //     hValue,
        // });

        return {
            "lockId": "d7a1204d462f14da0299f7d57ae659b60e35fd", // 锁定ID
            "nlockDate": 1545559509,                           // 锁定时间(s)绝对时间
            "rawTransaction": "f4691f5c0488526c7a000323265000", // 原始交易
            "signHashList": [
                "bb9d8bc4f3686380937cb771b41e8150655912a48d7d" // 待签名哈希
            ]
        }
    }

    async sendLockTx({settlementId, lockId, rawTransaction, signList}) {
        this.print('EOS send hash lock tx params:', {settlementId, lockId, rawTransaction, signList});
        // return await this.post(GATEWAY_PATH.SEND_LOCK_TX, {
        //     settlementId,
        //     lockId,
        //     rawTransaction,
        //     signList
        // });
        return {
            "txHash": "c63d77274876797c1659c8613fe2c70fdf49fe6" // 锁定交易哈希
        }
    }

    async createWithdrawTx({settlementId, lockId, preimage, sender}) {
        this.print('EOS create withdraw tx params:', {settlementId, lockId, preimage, sender});
        // return await this.post(GATEWAY_PATH.CREATE_WITHDRAW_TX, {
        //     settlementId,
        //     lockId,
        //     preimage,
        //     sender
        // });
        return {
            "rawTransaction": "fb691f5c1188b2cd02270000000000", // 原始交易
            "signHashList": ["bb9d8bc4f3686380937cb771b41e8150655912a48d7d"] // 待签名哈希
        }
    }

    async sendWithdrawTx({settlementId, rawTransaction, signList}) {
        this.print('EOS send withdraw tx params:', {settlementId, rawTransaction, signList});
        // return await this.post(GATEWAY_PATH.SEND_WITHDRAW_TX, {
        //     settlementId,
        //     rawTransaction,
        //     signList
        // });
        return {
            "txHash": "ad937a4ab1b8657b0d16874018003b5531c4433" // 锁定交易哈希
        }
    }

    async createRefundTx({settlementId, lockId, sender}) {
        this.print('EOS create refund tx params:', {settlementId, lockId, sender});
        // return await this.post(GATEWAY_PATH.CREATE_REFUND_TX, {
        //     settlementId,
        //     lockId,
        //     sender
        // });
        return {
            "rawTransaction": "f7691f5c0a8858fd67410000000001", // 原始交易
            "signHashList": [
                "28503770f002474871d216eb0fd7fb3a0b80bae4be2"  // 待签名哈希
            ]
        }
    }

    async sendRefundTx({settlementId, rawTransaction, signList}) {
        this.print('EOS send refund tx params:', {settlementId, rawTransaction, signList});
        // return await this.post(GATEWAY_PATH.SEND_REFUND_TX, {
        //     settlementId,
        //     rawTransaction,
        //     signList
        // });
        return {
            "txHash": "4c34d32f01cb9ae36342b25dd2871ebfd0510d" // 赎回交易哈希
        }
    }
}

module.exports = EosGateway;