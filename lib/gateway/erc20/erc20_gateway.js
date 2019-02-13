const Connection = require("../../connection/connection");

const {GATEWAY_PATH} = require("../../common/constant");

class Erc20Gateway extends Connection {
    constructor(options) {
        super(options);
    }

    async getBalance(address) {
        return await this.post(GATEWAY_PATH.BALANCE, {
            address,
        });
    }

    async createApproveTx({sender, amount, settlementId}) {
        this.print('Erc20 create Approve Tx params:', {settlementId, sender, amount});
        // return await this.post(GATEWAY_PATH.CREATE_APPROVE_TX, {
        //     sender,
        //     amount,
        //     settlementId
        // });

        return {
            "blockHeight": 3452582,
            "gasLimit": 4100000,
            "gasPrice": 1000000000,
            "nonce": 311,
            "rawTransaction": '0xf868820137843b9aca00833e8fa0947c55ec238682e799c346f194d57f'//"0xf868820137843b9aca00833e8fa0947c55ec238682e799c346f194d57fa12d260b6a2280b844095ea7b300000000000000000000000081adec9478ece1e03bda3d10bbac89abb3ed12650000000000000000000000000000000000000000000000000de0b6b3a7640000"
        }
    }

    async sendApproveTx({settlementId, signedRawTransaction}) {
        this.print('Erc20 send Approve Tx params:', {settlementId, signedRawTransaction});
        // return await this.post(GATEWAY_PATH.SEND_APPROVE_TX, {
        //     settlementId,
        //     signedRawTransaction
        // });
        return {
            "txHash": "0xc8159f4ef5d58b7abc7e392a0b10d653c6ba20cb20bea63c08d779a0ab83c3d9"
        }
    }

    async createLockTx({settlementId, sender, receiver, hValue, lockTime, amount}) {
        this.print('Erc20 create hash lock tx params:', {settlementId, sender, receiver, hValue, lockTime, amount});
        // return await this.post(GATEWAY_PATH.CREATE_LOCK_TX, {
        //     settlementId,
        //     sender,
        //     receiver,
        //     hValue,
        //     lockTime,
        //     amount,
        // });
        return {
            "blockHeight": 3452631,
            "gasLimit": 4100000,
            "gasPrice": 1000000000,
            "lockId": "0x7e87ab88baa03474454988c0f22ab89d8ed07ab709c817d7c13f906be2487f24",
            "nLockNum": 3460964,
            "nonce": 312,
            "rawTransaction": '0xf868820137843b9aca00833e8fa0947c55ec238682e799c346f194d57f' //"0xf8c8820138843b9aca00833e8fa09481adec9478ece1e03bda3d10bbac89abb3ed126580b8a49e75f6ca000000000000000000000000c0f605f2e4ca4fbe3188565e3b6a8504ee76e5804c9f03c84470380ebf1a6af26855b70541bc70761aa0904193b6a2be8263fa85000000000000000000000000000000000000000000000000000000000034cf640000000000000000000000007c55ec238682e799c346f194d57fa12d260b6a22000000000000000000000000000000000000000000000000000000174876e800"
        }
    }

    async sendLockTx({settlementId, signedRawTransaction, lockId}) {
        this.print('Erc20 send hash lock tx params:', {settlementId, signedRawTransaction, lockId});
        // return await this.post(GATEWAY_PATH.SEND_LOCK_TX, {
        //     settlementId,
        //     signedRawTransaction,
        //     lockId,
        // });
        return {
            "txHash": "0xc8159f4ef5d58b7abc7e392a0b10d653c6ba20cb20bea63c08d779a0ab83c3d9"
        }
    }

    async createWithdrawTx({settlementId, sender, lockId, preimage}) {
        this.print('Erc20 create withdraw tx params:', {settlementId, sender, lockId, preimage});
        // return await this.post(GATEWAY_PATH.CREATE_WITHDRAW_TX, {
        //     settlementId,
        //     sender,
        //     lockId,
        //     preimage,
        // });
        return {
            "blockHeight": 3452668,
            "gasLimit": 4100000,
            "gasPrice": 1000000000,
            "nonce": 173,
            "rawTransaction": '0xf868820137843b9aca00833e8fa0947c55ec238682e799c346f194d57f'//"0xf9010781ad843b9aca00833e8fa09481adec9478ece1e03bda3d10bbac89abb3ed126580b8e406a536657e87ab88baa03474454988c0f22ab89d8ed07ab709c817d7c13f906be2487f240000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008033436e32544d4e6f6330347379334b394e4830474534566c3038385a6d3430776f4f4f6b52424b3164454239353453313871455762395331473872653837324461514f74553439377a49564e48455135394564726a413233497564595434415a614f3379394c516e484f68473756454d376a397236566e37374a4f5736313130"
        }

    }

    async sendWithdrawTx({settlementId, signedRawTransaction}) {
        this.print('Erc20 send withdraw tx params:', {settlementId, signedRawTransaction});
        // return await this.post(GATEWAY_PATH.SEND_WITHDRAW_TX, {
        //     signedRawTransaction,
        //     settlementId,
        // });
        return {
            "txHash": "0x812f36f51c1a128d823161fb5b58a2424092c34572a1d788d80907fdf726496f"
        }
    }

    async createRefundTx({settlementId, sender, lockId}) {
        this.print('Erc20 create refund tx params:', {settlementId, sender, lockId});
        // return await this.post(GATEWAY_PATH.SEND_LOCK_TX, {
        //     settlementId,
        //     sender,
        //     lockId,
        // });
        return {
            "rawTransaction": "0x382b1ad47a28b47547382b1ad47ac3a27ddfa8",
            "blockHeight": 10000,
            "gasLimit": 10000,
            "gasPrice": 2000,
            "nonce": 200
        }
    }

    async sendRefundTx({settlementId, signedRawTransaction}) {
        this.print('Erc20 send refund tx params:', {settlementId, signedRawTransaction});
        // return await this.post(GATEWAY_PATH.SEND_WITHDRAW_TX, {
        //     signedRawTransaction,
        //     settlementId
        // });
        return {
            "txHash": "0xe931b6b1c899ca6d7e5af06b8a4656dbb195a827bc8ecca85558fb5b1726faf1"
        }
    }


}

module.exports = Erc20Gateway;