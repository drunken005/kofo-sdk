const CONSTANT = {
    CONNECTION: {
        SUCCESS_CODE: "000000",
        TIMEOUT: 5 * 1000,
        HEADERS: {"Content-Type": "application/json"},

    },
    LOGGER: {
        LEVEL: "info",
        NAME: "logger",
        FMT: "YYYY-MM-DD HH:mm:ss.SSS",
    },
    MQ_MESSAGE_TYPE: {
        makerCreateRefundTxAndH: "maker_create_refund_tx_and_h",
        takerReceiveHAndCreateRefundTx: "taker_receive_h_and_create_refund_tx",

        makerSubmitHashLockTx: "maker_submit_hash_lock_tx",
        takerSubmitHashLockTx: "taker_submit_hash_lock_tx",

        makerSubmitWithdrawTx: "maker_submit_withdraw_tx",
        takerSubmitWithdrawTx: "taker_submit_withdraw_tx",

        makerSubmitRefundTx: 'maker_submit_refund_tx',
        takerSubmitRefundTx: 'taker_submit_refund_tx',

        makerSubmitApproveTx: 'maker_submit_approve_tx',
        takerSubmitApproveTx: 'taker_submit_approve_tx',


        makerPreImage: "maker_preimage",
        makerHValue: "maker_hvalue",
        makerPublicKey: "maker_public_key",

        makerCounterChainPublicKey: "maker_counter_chain_public_key",
        takerPublicKey: "taker_public_key",
        takerCounterChainPublicKey: "taker_counter_chain_public_key",
        takerHValue: "taker_hvalue",

        makerLockTxHash: "maker_lock_tx_hash",
        takerLockTxHash: "taker_lock_tx_hash",

        makerWithdrawTxHash: "maker_withdraw_tx_hash",
        takerWithdrawTxHash: "taker_withdraw_tx_hash",

        makerRefundTxHash: "maker_refund_tx_hash",
        takerRefundTxHash: "taker_refund_tx_hash",

        makerApproveTxHash: 'maker_approve_tx_hash',
        takerApproveTxHash: 'taker_approve_tx_hash',

        locker: "locker"

    },

    KOFO_EVENT_TYPE: {
        signature: 'kofo_tx_signature',
        notice: 'kofo_status_notice'
    },
    NOTICE_TYPE: {
        initSdk: 'init_sdk',
        preHashLock: 'pre_hash_lock',
        submitHashLock: 'submit_hash_lock',
        successHashLock: 'success_hash_lock',
        failHashLock: 'fail_hash_lock',

        preWithdraw: 'pre_withdraw',
        submitWithdraw: 'submit_withdraw',
        successWithdraw: 'success_withdraw',
        failWithdraw: 'fail_withdraw',

        preRefund: 'pre_refund',
        submitRefund: 'submit_refund',
        successRefund: 'success_refund',
        failRefund: 'fail_refund',

        preApprove: 'pre_approve',
        submitApprove: 'submit_approve',
        successApprove: 'success_approve',
        failApprove: 'fail_approve',

        complete: 'complete'

    },

    SIGN_CALLBACK_TYPE: {
        makerHashLockTxSign: 'maker_hash_lock_tx_sign',
        takerHashLockTxSign: 'taker_hash_lock_tx_sign',

        makerWithdrawTxSign: 'maker_withdraw_tx_sign',
        takerWithdrawTxSign: 'taker_withdraw_tx_sign',

        makerRefundTxSign: 'maker_refund_tx_sign',
        takerRefundTxSign: 'taker_refund_tx_sign',

        makerApproveTxSign: 'maker_approve_tx_sign',
        takerApproveTxSign: 'taker_approve_tx_sign'
    },

    GATEWAY_PATH: {
        BALANCE: "/balance",
        CREATE_APPROVE_TX: "/create_approve_tx",
        SEND_APPROVE_TX: "/send_approve_tx",
        CREATE_LOCK_TX: "/create_lock_tx",
        SEND_LOCK_TX: "/send_lock_tx",
        CREATE_WITHDRAW_TX: "/create_withdraw_tx",
        SEND_WITHDRAW_TX: "/send_withdraw_tx",
        CREATE_REFUND_TX: "/create_refund_tx",
        SEND_REFUND_TX: "/send_refund_tx"
    }
};

module.exports = CONSTANT;