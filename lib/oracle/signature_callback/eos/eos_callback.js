const Oracle = require('../../oracle');

class EosSignatureCallback extends Oracle {

    constructor() {
        let args = Array.prototype.slice.apply(arguments);
        super(...args);
    }

    async makerHashLockTxSignCallback(settlementId, signList) {
        this.print('EOS makerHashLockTxSign signature_callback params: ', {settlementId, signList});

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
                rawTransaction,
                signList,
                lockId,
            });
            await this.insertMakerData(keyMakerLockTxHash, lockTxHash);

            await this.settlementProvider.makerSubmitHashLockCallback(chain, settlementId, lockId, lockTxHash.txHash, blockHeight, nLockNum);
            this.insertMakerData(keyMakerSubmitHashLockTxLocker, false);
            // this.emit(message.type, message);

        } catch (err) {
            this.insertMakerData(keyMakerSubmitHashLockTxLocker, false);
            throw  err;
        }
    }

    async takerHashLockTxSignCallback(settlementId, signList) {
        this.print('EOS takerHashLockTxSignCallback signature_callback params: ', {settlementId, signList});
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
                rawTransaction,
                signList,
                lockId,
            });

            this.print('EOS taker send hash lock tx result:', lockTxHash);
            await this.insertData(keyTakerLockTxHash, lockTxHash);
            await this.settlementProvider.takerSubmitHashLockCallback(chain, settlementId, lockId, rawTransaction, lockTxHash.txHash, blockHeight, nLockNum);
            this.insertData(keyTakerSubmitHashLockTxLocker, false);
            // this.emit(message.type, message);

        } catch (err) {
            this.insertData(keyTakerSubmitHashLockTxLocker, false);
            throw  err;
        }
    }

    async makerWithdrawTxSignCallback(settlementId, signList) {
        this.print('EOS makerWithdrawTxSign signature_callback params: ', {settlementId, signList});

        const {keyMakerWithdrawTxHash, keyMakerSubmitWithdrawTx, keyMakerCreateRefundTxAndH, keyMakerSubmitWithdrawTxLocker} = this.makerKeysMapping(settlementId);

        let makerCreateRefundTxAndH = this.readMakerData(keyMakerCreateRefundTxAndH);
        let makerWithdrawTx = this.readMakerData(keyMakerSubmitWithdrawTx);

        if (!makerCreateRefundTxAndH) {
            this.logger.info(`operation=return||flow=${keyMakerCreateRefundTxAndH}`);
            return;
        }

        const {takerChain, takerCurrency} = makerCreateRefundTxAndH;

        try {
            let gatewayProvider = this.getGatewayProvider(takerChain, takerCurrency);
            let {rawTransaction} = makerWithdrawTx;
            let makerWithdrawTxHash = await gatewayProvider.sendWithdrawTx({
                settlementId,
                rawTransaction,
                signList
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

    async takerWithdrawTxSignCallback(settlementId, signList) {

        this.print('EOS takerWithdrawTxSignCallback signature_callback params: ', {
            settlementId,
            signList
        });

        const {keyTakerWithdrawTxHash, keyTakerSubmitHashLockTxLocker, keyTakerSubmitWithdrawTx, keyTakerReceiveHAndCreateRefundTx} = this.takerKeysMapping(settlementId);

        const takerReceiveHAndCreateRefundTx = this.readData(keyTakerReceiveHAndCreateRefundTx);
        const takerWithdrawTx = this.readData(keyTakerSubmitWithdrawTx);

        if (!takerReceiveHAndCreateRefundTx) {
            this.logger.info(`operation=return||flow=${keyTakerReceiveHAndCreateRefundTx}`);
            return;
        }

        const {makerChain, makerCurrency} = takerReceiveHAndCreateRefundTx;

        try {
            let gatewayProvider = this.getGatewayProvider(makerChain, makerCurrency);
            let {rawTransaction} = takerWithdrawTx;
            let takerWithdrawTxHash = await gatewayProvider.sendWithdrawTx({
                settlementId,
                rawTransaction,
                signList
            });

            this.print('Eos taker send withdraw tx result:::', takerWithdrawTxHash);

            this.insertData(keyTakerWithdrawTxHash, takerWithdrawTxHash);
            await this.settlementProvider.takerSubmitWithdrawCallback(makerChain, takerWithdrawTxHash.txHash, settlementId);
            this.insertData(keyTakerSubmitHashLockTxLocker, false);
            // this.event.emit(message.type, message);
        } catch (err) {
            this.insertData(keyTakerSubmitHashLockTxLocker, false);
            throw  err;
        }
    }

    async makerRefundTxSignCallback(settlementId, signList) {
        this.print('EOS makerRefundTxSignCallback signature_callback params: ', {
            settlementId,
            signList
        });

        const {keyMakerCreateRefundTxAndH, keyMakerRefundTxHash, keyMakerSubmitRefundTxLocker, keyMakerSubmitRefundTx} = this.makerKeysMapping(settlementId);

        let makerCreateRefundTxAndH = this.readMakerData(keyMakerCreateRefundTxAndH);
        let makerRefundTx = this.readMakerData(keyMakerSubmitRefundTx);
        if (!makerCreateRefundTxAndH) {
            this.logger.info(`operation=return||flow=${keyMakerCreateRefundTxAndH}`);
            return;
        }
        const {takerChain, takerCurrency} = makerCreateRefundTxAndH;
        try {
            let gatewayProvider = this.getGatewayProvider(takerChain, takerCurrency);
            let {rawTransaction} = makerRefundTx;
            let makerWithdrawTxHash = await gatewayProvider.sendRefundTx({
                settlementId,
                rawTransaction,
                signList
            });


            this.insertMakerData(keyMakerRefundTxHash, makerWithdrawTxHash);
            await this.settlementProvider.makerSubmitRefundCallback(takerChain, settlementId, makerWithdrawTxHash.txHash);
            this.insertMakerData(keyMakerSubmitRefundTxLocker, false);
            // this.event.emit(message.type, message);
        } catch (err) {
            this.insertMakerData(keyMakerSubmitRefundTxLocker, false);
            throw  err;
        }
    }

    async takerRefundTxSignCallback(settlementId, signList) {
        this.print('EOS takerRefundTxSignCallback signature_callback params: ', {
            settlementId,
            signList
        });

        const {keyTakerReceiveHAndCreateRefundTx, keyTakerRefundTxHash, keyTakerSubmitRefundTxLocker, keyTakerSubmitRefundTx} = this.takerKeysMapping(settlementId);

        let takerReceiveHAndCreateRefundTx = this.readData(keyTakerReceiveHAndCreateRefundTx);
        let takerRefundTx = this.readData(keyTakerSubmitRefundTx);

        if (!takerReceiveHAndCreateRefundTx) {
            this.logger.info(`operation=return||flow=${keyTakerReceiveHAndCreateRefundTx}`);
            return;
        }
        const {makerChain, makerCurrency,} = takerReceiveHAndCreateRefundTx;
        try {
            let gatewayProvider = this.getGatewayProvider(makerChain, makerCurrency);
            let {rawTransaction} = takerRefundTx;
            let makerWithdrawTxHash = await gatewayProvider.sendRefundTx({
                settlementId,
                rawTransaction,
                signList
            });

            this.insertData(keyTakerRefundTxHash, makerWithdrawTxHash);
            await this.settlementProvider.takerSubmitRefundCallback(makerChain, settlementId, makerWithdrawTxHash.txHash);
            this.insertData(keyTakerSubmitRefundTxLocker, false);
            // this.event.emit(message.type, message);
        } catch (err) {
            this.insertData(keyTakerSubmitRefundTxLocker, false);
            throw  err;
        }
    }

}

module.exports = EosSignatureCallback;