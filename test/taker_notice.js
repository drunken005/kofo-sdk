const init_sdk = {"type": "init_sdk", "status": "success", "message": "Init sdk success and connected mqtt server."};
const settlement_info = {
    "hValue": "17b32937a2ab2bfa0160917a5318fb86d817ba792d6b3474e827a2831d5a697f",
    "makerAmount": "0.500000000000000000000000000000",
    "makerChain": "eth",
    "makerClientId": "02a95024e899468bbe2e091444cd01366b141f1209faef9a3cf76eeb383b7dcfe1",
    "makerCounterChainPubKey": "alice",
    "makerCurrency": "zil",
    "makerFee": "0.000000000000000000000000000000",
    "makerLocktime": 7200,
    "makerPubKey": "0x047ee4370138916819d252686cdee323c5a01c2a203e00eb3b3fb588df9c79562601615e6969375f7bea207b6051940994d1e45fc221b3073ce2a5b97dc20349b9",
    "roleEnum": "TAKER",
    "settlementId": "1550544053629_0101231005",
    "symbol": null,
    "takerAmount": "9.000000000000000000000000000000",
    "takerChain": "eos",
    "takerClientId": "023fbf8ded0155ef73b25c19e20a4a92f984ffe621e8d1b0a2572e593469c1016e",
    "takerCounterChainPubKey": "0x0421caaf99e3f0069b7889e2ebed593e2daa4d1f01575e1469787abcf02bbc012ee62e020037be4e944edf2a24d589dba389bd3a61df6f2bbc146abda7f39f69a9",
    "takerCurrency": "eos",
    "takerLocktime": 6,
    "takerOrderId": "null",
    "takerPubKey": "drunken",
    "chain": "eos",
    "currency": "eos",
    "type": "settlement_info"
};
const pre_hash_lock = {
    "settlementId": "1550544053629_0101231005",
    "roleEnum": "TAKER",
    "chain": "eos",
    "currency": "eos",
    "amount": "9.000000000000000000000000000000",
    "pubKey": "drunken",
    "lockTx": {
        "lockId": "f07eca89630ccbb37228a021015e8f698610794ab6583474c84054e37bb6a4a1",
        "nlockDate": 1550544196,
        "rawTransaction": "4d7b6b5c86f50917dd8d000000000100a6823403ea3055000000572d3ccdcd01000000602a38f54d00000000a8ed323272000000602a38f54d009001576da790ba905f01000000000004454f530000000051616c6963652d313762333239333761326162326266613031363039313761353331386662383664383137626137393264366233343734653832376132383331643561363937662d3135353035343431393600",
        "signHashList": ["204e44f212999e6bfce622300b0f3ff6b59144db02ffba8fdf5c08ea353da302"]
    },
    "type": "pre_hash_lock"
};
const submit_hash_lock = {
    "settlementId": "1550544053629_0101231005",
    "roleEnum": "TAKER",
    "chain": "eos",
    "currency": "eos",
    "amount": "9.000000000000000000000000000000",
    "pubKey": "drunken",
    "lockTxHash": "cb2c58499c4c92d4c732637c1a5cd289574a23123b9ce2e00c9b8f597b8f725a",
    "type": "submit_hash_lock"
};
const success_hash_lock = {
    "settlementId": "1550544053629_0101231005",
    "roleEnum": "TAKER",
    "chain": "eos",
    "currency": "eos",
    "amount": "9.000000000000000000000000000000",
    "pubKey": "drunken",
    "lockTx": {
        "lockId": "f07eca89630ccbb37228a021015e8f698610794ab6583474c84054e37bb6a4a1",
        "nlockDate": 1550544196,
        "rawTransaction": "4d7b6b5c86f50917dd8d000000000100a6823403ea3055000000572d3ccdcd01000000602a38f54d00000000a8ed323272000000602a38f54d009001576da790ba905f01000000000004454f530000000051616c6963652d313762333239333761326162326266613031363039313761353331386662383664383137626137393264366233343734653832376132383331643561363937662d3135353035343431393600",
        "signHashList": ["204e44f212999e6bfce622300b0f3ff6b59144db02ffba8fdf5c08ea353da302"]
    },
    "lockTxHash": "cb2c58499c4c92d4c732637c1a5cd289574a23123b9ce2e00c9b8f597b8f725a",
    "type": "success_hash_lock"
};
const pre_refund = {
    "settlementId": "1550544053629_0101231005",
    "roleEnum": "TAKER",
    "chain": "eos",
    "currency": "eos",
    "lockId": "f07eca89630ccbb37228a021015e8f698610794ab6583474c84054e37bb6a4a1",
    "pubKey": "drunken",
    "refundTx": {
        "rawTransaction": "667b6b5cb8f53f066f390000000001009001576da790ba00000000a4a997ba01000000602a38f54d00000000a8ed323228f07eca89630ccbb37228a021015e8f698610794ab6583474c84054e37bb6a4a1000000602a38f54d00",
        "signHashList": ["cf286ae16ba0b2e847dc44bcccac301f5a3d6ca7f77002fd57f5889045b0a04c"]
    },
    "type": "pre_refund"
};
const fail_refund = {
    "settlementId": "1550544053629_0101231005",
    "roleEnum": "TAKER",
    "chain": "eos",
    "currency": "eos",
    "lockId": "f07eca89630ccbb37228a021015e8f698610794ab6583474c84054e37bb6a4a1",
    "pubKey": "drunken",
    "refundTx": {
        "rawTransaction": "667b6b5cb8f53f066f390000000001009001576da790ba00000000a4a997ba01000000602a38f54d00000000a8ed323228f07eca89630ccbb37228a021015e8f698610794ab6583474c84054e37bb6a4a1000000602a38f54d00",
        "signHashList": ["cf286ae16ba0b2e847dc44bcccac301f5a3d6ca7f77002fd57f5889045b0a04c"]
    },
    "refundTxHash": null,
    "type": "fail_refund"
};
const submit_refund = {
    "settlementId": "1550544053629_0101231005",
    "roleEnum": "TAKER",
    "chain": "eos",
    "currency": "eos",
    "lockId": "f07eca89630ccbb37228a021015e8f698610794ab6583474c84054e37bb6a4a1",
    "pubKey": "drunken",
    "refundTx": {
        "rawTransaction": "667b6b5cb8f53f066f390000000001009001576da790ba00000000a4a997ba01000000602a38f54d00000000a8ed323228f07eca89630ccbb37228a021015e8f698610794ab6583474c84054e37bb6a4a1000000602a38f54d00",
        "signHashList": ["cf286ae16ba0b2e847dc44bcccac301f5a3d6ca7f77002fd57f5889045b0a04c"]
    },
    "refundTxHash": "de0137241417a30e30e64dc5759596d1a000e9a6007648ad6121ad9b5e3df6ce",
    "type": "submit_refund"
};
const success_refund = {
    "settlementId": "1550544053629_0101231005",
    "roleEnum": "TAKER",
    "chain": "eos",
    "currency": "eos",
    "lockId": "f07eca89630ccbb37228a021015e8f698610794ab6583474c84054e37bb6a4a1",
    "pubKey": "drunken",
    "refundTx": {
        "rawTransaction": "667b6b5cb8f53f066f390000000001009001576da790ba00000000a4a997ba01000000602a38f54d00000000a8ed323228f07eca89630ccbb37228a021015e8f698610794ab6583474c84054e37bb6a4a1000000602a38f54d00",
        "signHashList": ["cf286ae16ba0b2e847dc44bcccac301f5a3d6ca7f77002fd57f5889045b0a04c"]
    },
    "refundTxHash": "de0137241417a30e30e64dc5759596d1a000e9a6007648ad6121ad9b5e3df6ce",
    "type": "success_refund"
};
const init_sdk = {"type":"init_sdk","status":"failed","message":"mqtt server disconnect"}; 
const init_sdk = {"type":"init_sdk","status":"success","message":"mqtt server reconnect"}; 
const init_sdk = {"type":"init_sdk","status":"success","message":"Init sdk success and connected mqtt server."}; 
const complete = {"settlementId":"1550544053629_0101231005","roleEnum":"TAKER","chain":"eos","currency":"eos","type":"complete"}; 
const init_sdk = {"type":"init_sdk","status":"failed","message":"mqtt server disconnect"}; 
const init_sdk = {"type":"init_sdk","status":"success","message":"mqtt server reconnect"}; 
const init_sdk = {"type":"init_sdk","status":"success","message":"Init sdk success and connected mqtt server."}; 
