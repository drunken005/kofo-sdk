const init_sdk = {"type": "init_sdk", "status": "success", "message": "Init sdk success and connected mqtt server."};
const settlement_info = {
    "makerAmount": "1.000000000000000000000000000000",
    "makerChain": "eth",
    "makerClientId": "02a95024e899468bbe2e091444cd01366b141f1209faef9a3cf76eeb383b7dcfe1",
    "makerCounterChainPubKey": "alice",
    "makerCurrency": "eth",
    "makerFee": "0.000000000000000000000000000000",
    "makerLocktime": 7200,
    "makerOrderId": "null",
    "makerPubKey": "0x047ee4370138916819d252686cdee323c5a01c2a203e00eb3b3fb588df9c79562601615e6969375f7bea207b6051940994d1e45fc221b3073ce2a5b97dc20349b9",
    "roleEnum": "MAKER",
    "settlementId": "1550499077817_0101231001",
    "symbol": null,
    "takerAmount": "15.000000000000000000000000000000",
    "takerChain": "eos",
    "takerClientId": "023fbf8ded0155ef73b25c19e20a4a92f984ffe621e8d1b0a2572e593469c1016e",
    "takerCounterChainPubKey": "0x0421caaf99e3f0069b7889e2ebed593e2daa4d1f01575e1469787abcf02bbc012ee62e020037be4e944edf2a24d589dba389bd3a61df6f2bbc146abda7f39f69a9",
    "takerCurrency": "eos",
    "takerLocktime": 3600,
    "takerPubKey": "drunken",
    "chain": "eth",
    "currency": "eth",
    "type": "settlement_info"
};
const pre_approve = {
    "settlementId": "1550500625412_0101231003",
    "roleEnum": "MAKER",
    "chain": "eth",
    "currency": "zil",
    "pubKey": "0x047ee4370138916819d252686cdee323c5a01c2a203e00eb3b3fb588df9c79562601615e6969375f7bea207b6051940994d1e45fc221b3073ce2a5b97dc20349b9",
    "approveTx": {
        "blockHeight": 3891439,
        "gasLimit": 310000,
        "gasPrice": 2000000000,
        "nonce": 37,
        "rawTransaction": "0xf8662584773594008304baf094a35c9c57f23420d6d8dbdba48e5023c2cd7d84d180b844095ea7b300000000000000000000000081adec9478ece1e03bda3d10bbac89abb3ed126500000000000000000000000000000000000000000000000000000374c1a67000"
    },
    "type": "pre_approve"
};
const submit_approve = {
    "settlementId": "1550500625412_0101231003",
    "roleEnum": "MAKER",
    "chain": "eth",
    "currency": "zil",
    "pubKey": "0x047ee4370138916819d252686cdee323c5a01c2a203e00eb3b3fb588df9c79562601615e6969375f7bea207b6051940994d1e45fc221b3073ce2a5b97dc20349b9",
    "approveTx": {
        "blockHeight": 3891439,
        "gasLimit": 310000,
        "gasPrice": 2000000000,
        "nonce": 37,
        "rawTransaction": "0xf8662584773594008304baf094a35c9c57f23420d6d8dbdba48e5023c2cd7d84d180b844095ea7b300000000000000000000000081adec9478ece1e03bda3d10bbac89abb3ed126500000000000000000000000000000000000000000000000000000374c1a67000"
    },
    "approveTxHash": "0x23b1ac316e1220b04cbc18056bf9203c961bc0da49d3144bef02cbbab82b13aa",
    "type": "submit_approve"
};
const success_approve = {
    "settlementId": "1550500625412_0101231003",
    "roleEnum": "MAKER",
    "chain": "eth",
    "currency": "zil",
    "pubKey": "0x047ee4370138916819d252686cdee323c5a01c2a203e00eb3b3fb588df9c79562601615e6969375f7bea207b6051940994d1e45fc221b3073ce2a5b97dc20349b9",
    "approveTx": {
        "blockHeight": 3891439,
        "gasLimit": 310000,
        "gasPrice": 2000000000,
        "nonce": 37,
        "rawTransaction": "0xf8662584773594008304baf094a35c9c57f23420d6d8dbdba48e5023c2cd7d84d180b844095ea7b300000000000000000000000081adec9478ece1e03bda3d10bbac89abb3ed126500000000000000000000000000000000000000000000000000000374c1a67000"
    },
    "approveTxHash": "0x23b1ac316e1220b04cbc18056bf9203c961bc0da49d3144bef02cbbab82b13aa",
    "type": "success_approve"
};
const pre_hash_lock = {
    "settlementId": "1550499077817_0101231001",
    "roleEnum": "MAKER",
    "chain": "eth",
    "currency": "eth",
    "amount": "1.000000000000000000000000000000",
    "pubKey": "0x047ee4370138916819d252686cdee323c5a01c2a203e00eb3b3fb588df9c79562601615e6969375f7bea207b6051940994d1e45fc221b3073ce2a5b97dc20349b9",
    "lockTx": {
        "blockHeight": 3891336,
        "gasLimit": 310000,
        "gasPrice": 2000000000,
        "lockId": "0xb75e0d8af431775b0e75933c5aeb1b05509e39ee63edfbbd9b9468b149dc11d6",
        "nLockNum": 3891936,
        "nonce": 35,
        "rawTransaction": "0xf88e2384773594008304baf0945502a0576e14e839cf72817f2ef15c3473b5ebd8880de0b6b3a7640000b864a80de0e80000000000000000000000005c7c9e06cf9faf957fc950887978a9434d0b5abb897235603a37157ed9cd192965d9afb043e02d257d9fa323604f973e7ca52f1c00000000000000000000000000000000000000000000000000000000003b62e0"
    },
    "type": "pre_hash_lock"
};
const submit_hash_lock = {
    "settlementId": "1550499077817_0101231001",
    "roleEnum": "MAKER",
    "chain": "eth",
    "currency": "eth",
    "amount": "1.000000000000000000000000000000",
    "pubKey": "0x047ee4370138916819d252686cdee323c5a01c2a203e00eb3b3fb588df9c79562601615e6969375f7bea207b6051940994d1e45fc221b3073ce2a5b97dc20349b9",
    "lockTxHash": "0x8a89f802208abaa93a77b26a074f1218ab9f4ae4d5b5310794e4bc6dbb8e0837",
    "type": "submit_hash_lock"
};
const success_hash_lock = {
    "settlementId": "1550499077817_0101231001",
    "roleEnum": "MAKER",
    "chain": "eth",
    "currency": "eth",
    "amount": "1.000000000000000000000000000000",
    "pubKey": "0x047ee4370138916819d252686cdee323c5a01c2a203e00eb3b3fb588df9c79562601615e6969375f7bea207b6051940994d1e45fc221b3073ce2a5b97dc20349b9",
    "lockTx": {
        "blockHeight": 3891336,
        "gasLimit": 310000,
        "gasPrice": 2000000000,
        "lockId": "0xb75e0d8af431775b0e75933c5aeb1b05509e39ee63edfbbd9b9468b149dc11d6",
        "nLockNum": 3891936,
        "nonce": 35,
        "rawTransaction": "0xf88e2384773594008304baf0945502a0576e14e839cf72817f2ef15c3473b5ebd8880de0b6b3a7640000b864a80de0e80000000000000000000000005c7c9e06cf9faf957fc950887978a9434d0b5abb897235603a37157ed9cd192965d9afb043e02d257d9fa323604f973e7ca52f1c00000000000000000000000000000000000000000000000000000000003b62e0"
    },
    "lockTxHash": "0x8a89f802208abaa93a77b26a074f1218ab9f4ae4d5b5310794e4bc6dbb8e0837",
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

const pre_withdraw = {
    "settlementId": "1550499077817_0101231001",
    "roleEnum": "MAKER",
    "chain": "eos",
    "currency": "eos",
    "lockId": "52666e365f172ccc5d34d4954c188a6247f4e61f031e895827b012a1699d20bc",
    "pubKey": "alice",
    "withdrawTx": {
        "rawTransaction": "76cb6a5cd8956fd9beb70000000001009001576da790ba000000dcdcd4b2e3010000000000855c3400000000a8ed3232aa0152666e365f172ccc5d34d4954c188a6247f4e61f031e895827b012a1699d20bc8001624f68314f3452726b59323251304c574552424a6a764e44373831306142397233745537633763643934733748663244445a6a3067724b387874776a4164737546345567334b4d35324c3379746f62306c37353561396d6b663341335977376f68365043507063373338373539776f77466a324e5937367772476746647931700000000000855c3400",
        "signHashList": ["0e787d7e8184763555a9b9d2ba97126078dc07f38a2c9adc32d7b2c94ef1f8c4"]
    },
    "type": "pre_withdraw"
};
const submit_withdraw = {
    "settlementId": "1550499077817_0101231001",
    "roleEnum": "MAKER",
    "chain": "eos",
    "currency": "eos",
    "lockId": "0xb75e0d8af431775b0e75933c5aeb1b05509e39ee63edfbbd9b9468b149dc11d6",
    "pubKey": "alice",
    "withdrawTx": {
        "rawTransaction": "76cb6a5cd8956fd9beb70000000001009001576da790ba000000dcdcd4b2e3010000000000855c3400000000a8ed3232aa0152666e365f172ccc5d34d4954c188a6247f4e61f031e895827b012a1699d20bc8001624f68314f3452726b59323251304c574552424a6a764e44373831306142397233745537633763643934733748663244445a6a3067724b387874776a4164737546345567334b4d35324c3379746f62306c37353561396d6b663341335977376f68365043507063373338373539776f77466a324e5937367772476746647931700000000000855c3400",
        "signHashList": ["0e787d7e8184763555a9b9d2ba97126078dc07f38a2c9adc32d7b2c94ef1f8c4"]
    },
    "withdrawTxHash": "37674a0e9c5ac792ae04ff023623aaa754774db1759b307f65d28359ba9d7d69",
    "type": "submit_withdraw"
};
const success_withdraw = {
    "settlementId": "1550499077817_0101231001",
    "roleEnum": "MAKER",
    "chain": "eos",
    "currency": "eos",
    "lockId": "0xb75e0d8af431775b0e75933c5aeb1b05509e39ee63edfbbd9b9468b149dc11d6",
    "pubKey": "alice",
    "withdrawTx": {
        "rawTransaction": "76cb6a5cd8956fd9beb70000000001009001576da790ba000000dcdcd4b2e3010000000000855c3400000000a8ed3232aa0152666e365f172ccc5d34d4954c188a6247f4e61f031e895827b012a1699d20bc8001624f68314f3452726b59323251304c574552424a6a764e44373831306142397233745537633763643934733748663244445a6a3067724b387874776a4164737546345567334b4d35324c3379746f62306c37353561396d6b663341335977376f68365043507063373338373539776f77466a324e5937367772476746647931700000000000855c3400",
        "signHashList": ["0e787d7e8184763555a9b9d2ba97126078dc07f38a2c9adc32d7b2c94ef1f8c4"]
    },
    "withdrawTxHash": "37674a0e9c5ac792ae04ff023623aaa754774db1759b307f65d28359ba9d7d69",
    "type": "success_withdraw"
};
const complete = {
    "settlementId": "1550499077817_0101231001",
    "roleEnum": "MAKER",
    "chain": "eth",
    "currency": "eth",
    "type": "complete"
};
