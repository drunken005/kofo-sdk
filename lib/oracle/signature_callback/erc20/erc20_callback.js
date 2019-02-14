const Oracle = require('../../oracle');

class Erc20SignatureCallback extends Oracle {

    constructor() {
        let args = Array.prototype.slice.apply(arguments);
        super(...args);
    }

    async makerHashLockTxSignCallback(settlementId, signedRawTransaction) {
        this.print('Erc20 makerHashLockTxSign signature_callback params: ', {
            settlementId,
            signedRawTransaction
        }, false);
        const {keyMakerLockTxHash, keyMakerSubmitHashLockTx, keyMakerCreateRefundTxAndH, keyMakerSubmitHashLockTxLocker} = this.makerKeysMapping(settlementId);
        let makerCreateRefundTxAndH = this.readMakerData(keyMakerCreateRefundTxAndH);
        if (!makerCreateRefundTxAndH) {
            this.logger.info(`operation=return||flow=${keyMakerSubmitHashLockTxLocker}`);
            return;
        }
        const {makerChain, makerCurrency, chain} = makerCreateRefundTxAndH;
        try {
            let {lockId, rawTransaction, blockHeight, nLockNum} = this.readMakerData(keyMakerSubmitHashLockTx);
            let gatewayProvider = this.getGatewayProvider(makerChain, makerCurrency);
            let lockTxHash = await gatewayProvider.sendLockTx({
                settlementId,
                signedRawTransaction,
                lockId,
            });
            await this.insertMakerData(keyMakerLockTxHash, lockTxHash);
            this.print('Erc20 maker submit hash lock callback params: ', {
                chain,
                rawTransaction,
                txHash: lockTxHash.txHash,
                lockId,
                settlementId
            });
            await this.settlementProvider.makerSubmitHashLockCallback(chain, settlementId, lockId,  rawTransaction, lockTxHash.txHash, blockHeight, nLockNum);
            this.insertMakerData(keyMakerSubmitHashLockTxLocker, true);
            this.event.emit('maker_hash_lock_done', {settlementId});
        } catch (err) {
            this.insertMakerData(keyMakerSubmitHashLockTxLocker, false);
            throw  err;
        }
    }

    async takerHashLockTxSignCallback(settlementId, signedRawTransaction) {
        this.print('Erc20 takerHashLockTxSign signature_callback params: ', {settlementId, signedRawTransaction});
        let {keyTakerLockTxHash, keyTakerSubmitHashLockTx, keyTakerSubmitHashLockTxLocker, keyTakerReceiveHAndCreateRefundTx} = this.takerKeysMapping(settlementId);
        let takerReceiveHAndCreateRefundTx = this.readData(keyTakerReceiveHAndCreateRefundTx);
        if (!takerReceiveHAndCreateRefundTx) {
            this.logger.info(`operation=return||flow=${keyTakerReceiveHAndCreateRefundTx}`);
            return;
        }
        const {takerChain, takerCurrency, chain} = takerReceiveHAndCreateRefundTx;
        try {
            let {lockId, rawTransaction, blockHeight, nLockNum} = this.readData(keyTakerSubmitHashLockTx);
            let gatewayProvider = this.getGatewayProvider(takerChain, takerCurrency);
            let lockTxHash = await gatewayProvider.sendLockTx({
                settlementId,
                signedRawTransaction,
                lockId,
            });

            await this.insertData(keyTakerLockTxHash, lockTxHash);
            await this.settlementProvider.takerSubmitHashLockCallback(chain, settlementId, lockId,  rawTransaction, lockTxHash.txHash, blockHeight, nLockNum);
            this.insertData(keyTakerSubmitHashLockTxLocker, false);
            // this.emit(message.type, message);
        } catch (err) {
            this.insertData(keyTakerSubmitHashLockTxLocker, false);
            throw  err;
        }
    }

    async makerWithdrawTxSignCallback(settlementId, signedRawTransaction) {
        this.print('Erc20 makerWithdrawTxSign signature_callback params: ', {settlementId, signedRawTransaction});
        const {keyMakerWithdrawTxHash, keyMakerCreateRefundTxAndH, keyMakerSubmitWithdrawTxLocker} = this.makerKeysMapping(settlementId);
        let makerCreateRefundTxAndH = this.readMakerData(keyMakerCreateRefundTxAndH);
        if (!makerCreateRefundTxAndH) {
            this.logger.info(`operation=return||flow=${keyMakerCreateRefundTxAndH}`);
            return;
        }
        const {takerChain, takerCurrency} = makerCreateRefundTxAndH;
        try {
            let gatewayProvider = this.getGatewayProvider(takerChain, takerCurrency);
            let makerWithdrawTxHash = await gatewayProvider.sendWithdrawTx({
                signedRawTransaction,
                settlementId,
            });
            this.insertMakerData(keyMakerWithdrawTxHash, makerWithdrawTxHash);
            await this.settlementProvider.makerSubmitWithdrawCallback(takerChain, makerWithdrawTxHash.txHash, settlementId);
            this.insertMakerData(keyMakerSubmitWithdrawTxLocker, false);
            // this.event.emit(message.type, message);
        } catch (err) {
            this.insertMakerData(keyMakerSubmitWithdrawTxLocker, false);
            throw  err;
        }
    }

    async takerWithdrawTxSignCallback(settlementId, signedRawTransaction) {
        this.print('Erc20 takerWithdrawTxSignCallback signature_callback params: ', {
            settlementId,
            signedRawTransaction
        });
        const {keyTakerWithdrawTxHash, keyTakerSubmitHashLockTxLocker, keyTakerReceiveHAndCreateRefundTx} = this.takerKeysMapping(settlementId);
        const takerReceiveHAndCreateRefundTx = this.readData(keyTakerReceiveHAndCreateRefundTx);
        if (!takerReceiveHAndCreateRefundTx) {
            this.logger.info(`operation=return||flow=${keyTakerReceiveHAndCreateRefundTx}`);
            return;
        }
        const {makerChain, makerCurrency} = takerReceiveHAndCreateRefundTx;
        try {
            let gatewayProvider = this.getGatewayProvider(makerChain, makerCurrency);
            let takerWithdrawTxHash = await gatewayProvider.sendWithdrawTx({
                signedRawTransaction,
                settlementId,
            });
            this.insertData(keyTakerWithdrawTxHash, takerWithdrawTxHash);
            await this.settlementProvider.takerSubmitWithdrawCallback(makerChain, takerWithdrawTxHash.txHash, settlementId);
            this.insertData(keyTakerSubmitHashLockTxLocker, false);
            // this.event.emit(message.type, message);
        } catch (err) {
            this.insertData(keyTakerSubmitHashLockTxLocker, false);
            throw  err;
        }
    }

    async makerRefundTxSignCallback(settlementId, signedRawTransaction) {
        this.print('Erc20 makerRefundTxSignCallback signature_callback params: ', {
            settlementId,
            signedRawTransaction
        });
        const {keyMakerCreateRefundTxAndH, keyMakerRefundTxHash, keyMakerSubmitRefundTxLocker} = this.makerKeysMapping(settlementId);
        let makerCreateRefundTxAndH = this.readMakerData(keyMakerCreateRefundTxAndH);
        if (!makerCreateRefundTxAndH) {
            this.logger.info(`operation=return||flow=${keyMakerCreateRefundTxAndH}`);
            return;
        }
        const {makerChain, makerCurrency} = makerCreateRefundTxAndH;
        try {
            let gatewayProvider = this.getGatewayProvider(makerChain, makerCurrency);
            let makerWithdrawTxHash = await gatewayProvider.sendRefundTx({
                signedRawTransaction,
                settlementId,
            });
            this.insertMakerData(keyMakerRefundTxHash, makerWithdrawTxHash);
            await this.settlementProvider.makerSubmitRefundCallback(makerChain, settlementId, makerWithdrawTxHash.txHash);
            this.insertMakerData(keyMakerSubmitRefundTxLocker, false);
            // this.event.emit(message.type, message);
        } catch (err) {
            this.insertMakerData(keyMakerSubmitRefundTxLocker, false);
            throw  err;
        }
    }

    async takerRefundTxSignCallback(settlementId, signedRawTransaction) {
        this.print('Erc20 takerRefundTxSignCallback signature_callback params: ', {
            settlementId,
            signedRawTransaction
        });
        const {keyTakerReceiveHAndCreateRefundTx, keyTakerRefundTxHash, keyTakerSubmitRefundTxLocker} = this.takerKeysMapping(settlementId);
        let takerReceiveHAndCreateRefundTx = this.readData(keyTakerReceiveHAndCreateRefundTx);
        if (!takerReceiveHAndCreateRefundTx) {
            this.logger.info(`operation=return||flow=${keyTakerReceiveHAndCreateRefundTx}`);
            return;
        }
        const {takerChain, takerCurrency,} = takerReceiveHAndCreateRefundTx;
        try {
            let gatewayProvider = this.getGatewayProvider(takerChain, takerCurrency);
            let makerWithdrawTxHash = await gatewayProvider.sendRefundTx({
                signedRawTransaction,
                settlementId,
            });
            this.insertData(keyTakerRefundTxHash, makerWithdrawTxHash);
            await this.settlementProvider.takerSubmitRefundCallback(takerChain, settlementId, makerWithdrawTxHash.txHash);
            this.insertData(keyTakerSubmitRefundTxLocker, false);
            // this.event.emit(message.type, message);
        } catch (err) {
            this.insertData(keyTakerSubmitRefundTxLocker, false);
            throw  err;
        }
    }

    async makerApproveTxSignCallback(settlementId, signedRawTransaction) {
        this.print('Erc20 makerApproveTxSignCallback signature_callback params: ', {
            settlementId,
            signedRawTransaction
        });

        const {keyMakerCreateRefundTxAndH, keyMakerApproveTxHash, keyMakerSubmitApproveTxLocker} = this.makerKeysMapping(settlementId);

        let makerCreateRefundTxAndH = this.readMakerData(keyMakerCreateRefundTxAndH);

        if (!makerCreateRefundTxAndH) {
            this.logger.info(`operation=return||flow=${keyMakerSubmitApproveTxLocker}`);
            return;
        }
        const {makerChain, makerCurrency} = makerCreateRefundTxAndH;
        try {
            let gatewayProvider = this.getGatewayProvider(makerChain, makerCurrency);
            let makerApproveTxHash = await gatewayProvider.sendApproveTx({
                signedRawTransaction,
                settlementId,
            });


            this.insertMakerData(keyMakerApproveTxHash, makerApproveTxHash);
            await this.settlementProvider.makerSubmitApproveCallback(makerChain, settlementId, makerApproveTxHash.txHash);
            this.insertMakerData(keyMakerSubmitApproveTxLocker, false);
            // this.event.emit(message.type, message);
        } catch (err) {
            this.insertMakerData(keyMakerSubmitApproveTxLocker, false);
            throw  err;
        }
    }

    async takerApproveTxSignCallback(settlementId, signedRawTransaction) {
        this.print('Erc20 takerApproveTxSignCallback signature_callback params: ', {
            settlementId,
            signedRawTransaction
        });

        const {keyTakerReceiveHAndCreateRefundTx, keyTakerApproveTxHash, keyTakerSubmitApproveTxLocker} = this.takerKeysMapping(settlementId);

        let takerReceiveHAndCreateRefundTx = this.readData(keyTakerReceiveHAndCreateRefundTx);

        if (!takerReceiveHAndCreateRefundTx) {
            this.logger.info(`operation=return||flow=${keyTakerSubmitApproveTxLocker}`);
            return;
        }
        const {takerChain, takerCurrency} = takerReceiveHAndCreateRefundTx;
        try {
            let gatewayProvider = this.getGatewayProvider(takerChain, takerCurrency);
            let takerApproveTxHash = await gatewayProvider.sendApproveTx({
                signedRawTransaction,
                settlementId,
            });


            this.insertData(keyTakerApproveTxHash, takerApproveTxHash);
            await this.settlementProvider.takerSubmitApproveCallback(takerChain, settlementId, takerApproveTxHash.txHash);
            this.insertData(keyTakerSubmitApproveTxLocker, false);
            // this.event.emit(message.type, message);
        } catch (err) {
            this.insertData(keyTakerSubmitApproveTxLocker, false);
            throw  err;
        }
    }


}

module.exports = Erc20SignatureCallback;