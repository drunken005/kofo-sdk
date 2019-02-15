const pushMessageToSdk = require('./push_msg');
let maker_create_refund_tx_and_h = {
    "chain": "eth",
    "currency": "zil",
    "data": {
        "@type": "io.seg.chains.dex.common.model.message.eth.maker.EthMakerCreateRefundTxAndHMessageData",
        "makerAmount": "0.020000000000000000000000000000",
        "makerChain": "eth",
        "makerClientId": "test_ropsten_private_eth_client_id",
        "makerCounterChainPubKey": "03e5b5e7ec19ca1d93f98e2653bba9e50ce6280c7b4d56434d3bffdc215af4ff70",
        "makerCurrency": "zil",
        "makerFee": "0E-30",
        "makerLocktime": 3600,
        "makerOrderId": "null",
        "makerPubKey": "0xa2d3659ec26800498b2dd82cba0fe7d7a4637e743e5f4aaf55aac273c29c24e9a6a0748fcea2bb9dfece319eb454639778e02e67f02696afa9808dc593b08d2f",
        "roleEnum": "MAKER",
        "settlementId": "1537410563497_0000053030",
        "symbol": null,
        "takerAmount": "0.040000000000000000000000000000",
        "takerChain": "eos",
        "takerClientId": "test_ropsten_private_btc_client_id",
        "takerCounterChainPubKey": "0x02723fc6b3e3a858b49b74b40c20ecb8078b231c463e14178be81c798d4ec93d891d79c9c9fd79bee6f1102109bf963d411ebc0d44b5a8c6e3526e10799df1a2",
        "takerCurrency": "eos",
        "takerLocktime": 7200,
        "takerPubKey": "02b7a149d628d9327a6c2db12cc21293c795480404877988d947e86f86874c7522"
    },
    "serialVersionUID": -9052322409478952879,
    "type": "maker_create_refund_tx_and_h"
};

let taker_receive_h_and_create_refund_tx = {
    "chain": "eos",
    "currency": "eos",
    "data": {
        "@type": "io.seg.chains.dex.common.model.message.btc.taker.BtcTakerReceiveHAndRefundTxMessageData",
        "hValue": "2e5b5eec5580a3c4992e063bf2a3ff4da1bf3c4e9ddf1019dcc1cda4ce72c595",
        "makerAmount": "0.020000000000000000000000000000",
        "makerChain": "eth",
        "makerClientId": "test_ropsten_private_eth_client_id",
        "makerCounterChainPubKey": "03e5b5e7ec19ca1d93f98e2653bba9e50ce6280c7b4d56434d3bffdc215af4ff70",
        "makerCurrency": "zil",
        "makerFee": "0E-30",
        "makerLocktime": 3600,
        "makerPubKey": "0xa2d3659ec26800498b2dd82cba0fe7d7a4637e743e5f4aaf55aac273c29c24e9a6a0748fcea2bb9dfece319eb454639778e02e67f02696afa9808dc593b08d2f",
        "roleEnum": "TAKER",
        "settlementId": "1537410563497_0000053030",
        "symbol": null,
        "takerAmount": "0.040000000000000000000000000000",
        "takerChain": "eos",
        "takerClientId": "test_ropsten_private_btc_client_id",
        "takerCounterChainPubKey": "0x02723fc6b3e3a858b49b74b40c20ecb8078b231c463e14178be81c798d4ec93d891d79c9c9fd79bee6f1102109bf963d411ebc0d44b5a8c6e3526e10799df1a2",
        "takerCurrency": "eos",
        "takerFee": "0E-30",
        "takerLocktime": 7200,
        "takerOrderId": "null",
        "takerPubKey": "02b7a149d628d9327a6c2db12cc21293c795480404877988d947e86f86874c7522"
    },
    "serialVersionUID": -9052322409478952879,
    "type": "taker_receive_h_and_create_refund_tx"
};

let maker_submit_hash_lock_tx = {
    "chain": "eth",
    "currency": "zil",
    "data": {
        "@type": "io.seg.chains.dex.common.model.message.eth.maker.EthMakerSubmitHashlockTxMessageData",
        "hValue": "2e5b5eec5580a3c4992e063bf2a3ff4da1bf3c4e9ddf1019dcc1cda4ce72c595",
        "makerAmount": "0.020000000000000000000000000000",
        "makerChain": "eth",
        "makerClientId": "test_ropsten_private_eth_client_id",
        "makerLockId": "0x2d1f919da006e7d2c79f088ca56f23bc1eea516a20cab69b444994be0f63dfa4",
        "makerCurrency": "zil",
        "makerFee": "0E-30",
        "makerLocktime": 3600,
        "makerOrderId": "null",
        "makerPubKey": "0xa2d3659ec26800498b2dd82cba0fe7d7a4637e743e5f4aaf55aac273c29c24e9a6a0748fcea2bb9dfece319eb454639778e02e67f02696afa9808dc593b08d2f",
        "roleEnum": "MAKER",
        "settlementId": "1537410563497_0000053030",
        "symbol": null,
        "takerAmount": "0.040000000000000000000000000000",
        "takerChain": "eos",
        "takerClientId": "test_ropsten_private_btc_client_id",
        "takerCounterChainPubKey": "0x02723fc6b3e3a858b49b74b40c20ecb8078b231c463e14178be81c798d4ec93d891d79c9c9fd79bee6f1102109bf963d411ebc0d44b5a8c6e3526e10799df1a2",
        "takerCurrency": "eos",
        "takerLocktime": 7200,
        "takerPubKey": "02b7a149d628d9327a6c2db12cc21293c795480404877988d947e86f86874c7522"
    },
    "serialVersionUID": -9052322409478952879,
    "type": "maker_submit_hash_lock_tx"
};

let taker_submit_hash_lock_tx = {
    "chain": "eos",
    "currency": "eos",
    "data": {
        "@type": "io.seg.chains.dex.common.model.message.eth.taker.BtcTakerSubmitHashLockTxMessageData",
        "makerChain": "eth",
        "makerLockId": "0x2d1f919da006e7d2c79f088ca56f23bc1eea516a20cab69b444994be0f63dfa4",
        "makerCurrency": "zil",
        "makerHashLockTransactionId": "0x02ff4702d71b44b6c29c6aa454e5730f1b723eb2830f49f93379d72d22ff036a",
        "roleEnum": "TAKER",
        "settlementId": "1537410563497_0000053030",
        "takerChain": "eos",
        "takerCurrency": "eos",
        "takerOrderId": "null"
    },
    "serialVersionUID": -9052322409478952879,
    "type": "taker_submit_hash_lock_tx"
};

let maker_submit_withdraw_tx = {
    "chain": "eos",
    "currency": "eos",
    "data": {
        "@type": "io.seg.chains.dex.common.model.message.eth.maker.BtcMakerSubmitWithdrawTxMessageData",
        "index": 0,
        "makerChain": "eth",
        "makerCurrency": "zil",
        "makerOrderId": "null",
        "roleEnum": "MAKER",
        "settlementId": "1537410563497_0000053030",
        "takerChain": "eos",
        "takerCurrency": "eos",
        "takerHashLockTransactionId": "c035e2f1e4db711edafbf0a98b687da80ebd1808b20a4c5c465ddf461d4adb4b",
        "takerLockId": "c035e2f1e4db711edafbf0a98b687da80ebd1808b20a4c5c465ddf461d4adb4b"

    },
    "serialVersionUID": -9052322409478952879,
    "type": "maker_submit_withdraw_tx"
};

let taker_submit_withdraw_tx = {
    "chain": "eth",
    "currency": "zil",
    "data": {
        "@type": "io.seg.chains.dex.common.model.message.eth.taker.EthTakerSubmitWithdrawTxMessageData",
        "makerChain": "eth",
        "makerLockId": "0x2d1f919da006e7d2c79f088ca56f23bc1eea516a20cab69b444994be0f63dfa4",
        "makerCurrency": "eth",
        "roleEnum": "TAKER",
        "settlementId": "1537410563497_0000053030",
        "takerChain": "eos",
        "takerCurrency": "eos",
        "takerOrderId": "null",
        preimage: "vERUftc3U9O5nG85WG4NZpYhZN3doBtP84QjOoma72603524B76ud0G8h0cZwlh44vOoj8K8rOTO1vOzjngG1f2yq9BdU4gIZ4KxQ8nuhVCJZn1q693aaVi7yLxv4T83"
    },
    "serialVersionUID": -9052322409478952879,
    "type": "taker_submit_withdraw_tx"
};

let maker_submit_refund_tx = {
    "chain": "eos",
    "currency": "eos",
    "data": {
        "makerOrderId": "111",
        "makerChain": "eth",
        "makerCurrency": "zil",
        "settlementId": "1537410563497_0000053030",
        "takerChain": "eos",
        "takerCurrency": "eos"
    },
    "serialVersionUID": -9052322409478952879,
    "type": "maker_submit_refund_tx"
};

let taker_submit_refund_tx = {
    "chain": "eth",
    "currency": "zil",
    "data": {
        "takerOrderId": "111",
        "makerChain": "eth",
        "makerCurrency": "zil",
        "settlementId": "1537410563497_0000053030",
        "takerChain": "eth",
        "takerCurrency": "eth"
    },
    "serialVersionUID": -9052322409478952879,
    "type": "taker_submit_refund_tx"
};

let maker_submit_approve_tx = {
    "chain": "eth",
    "currency": "zil",
    "data": {
        "hValue": "c29820ceac7e2ed54fd43954d88e173ee682978cdab7240396cbc4d0167d0e3f",
        "makerAmount": "0.020000000000000000000000000000",
        "makerChain": "eth",
        "makerClientId": "test_ropsten_private_eth_client_id",
        "makerLockId": "0x2d1f919da006e7d2c79f088ca56f23bc1eea516a20cab69b444994be0f63dfa4",
        "makerCurrency": "zil",
        "makerFee": "0",
        "makerLocktime": 3600,
        "makerOrderId": "null",
        "makerPubKey": "0xa2d3659ec26800498b2dd82cba0fe7d7a4637e743e5f4aaf55aac273c29c24e9a6a0748fcea2bb9dfece319eb454639778e02e67f02696afa9808dc593b08d2f",
        "roleEnum": "MAKER",
        "settlementId": "1537410563497_0000053030",
        "symbol": null,
        "takerAmount": "0.040000000000000000000000000000",
        "takerChain": "eos",
        "takerClientId": "test_ropsten_private_btc_client_id",
        "takerCounterChainPubKey": "0x1abf46fc8b97fbfcdf57ec3977eb7eb89aeb69b82e459e3c192e6761df2db166fc13509630af579335a60099babb4f85e4212ac1dadd82961496533524e34437",
        "takerCurrency": "eos",
        "takerLocktime": 7200,
        "takerPubKey": "02b7a149d628d9327a6c2db12cc21293c795480404877988d947e86f86874c7522"
    },
    "serialVersionUID": -9052322409478952879,
    "type": "maker_submit_approve_tx"
};

let taker_submit_approve_tx = {
    "chain": "eth",
    "currency": "zil",
    "data": {
        "makerChain": "eth",
        "makerLockId": "0x2d1f919da006e7d2c79f088ca56f23bc1eea516a20cab69b444994be0f63dfa4",
        "makerCurrency": "eth",
        "makerHashLockTransactionId": "0x02ff4702d71b44b6c29c6aa454e5730f1b723eb2830f49f93379d72d22ff036a",
        "roleEnum": "TAKER",
        "settlementId": "1537410563497_0000053030",
        "takerChain": "eos",
        "takerCurrency": "eos",
        "takerOrderId": "null"
    },
    "serialVersionUID": -9052322409478952879,
    "type": "taker_submit_approve_tx"
};


//0xa2d3659ec26800498b2dd82cba0fe7d7a4637e743e5f4aaf55aac273c29c24e9a6a0748fcea2bb9dfece319eb454639778e02e67f02696afa9808dc593b08d2f
//0x1abf46fc8b97fbfcdf57ec3977eb7eb89aeb69b82e459e3c192e6761df2db166fc13509630af579335a60099babb4f85e4212ac1dadd82961496533524e34437



pushMessageToSdk(maker_create_refund_tx_and_h);
pushMessageToSdk(taker_receive_h_and_create_refund_tx);
pushMessageToSdk(maker_submit_hash_lock_tx);
// pushMessageToSdk(taker_submit_hash_lock_tx);
//
// pushMessageToSdk(maker_submit_withdraw_tx);
// pushMessageToSdk(taker_submit_withdraw_tx);
// pushMessageToSdk(maker_submit_refund_tx)
// pushMessageToSdk(taker_submit_refund_tx);
// pushMessageToSdk(maker_submit_approve_tx);
// pushMessageToSdk(taker_submit_approve_tx);



