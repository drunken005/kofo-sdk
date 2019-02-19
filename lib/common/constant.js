module.exports = {
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

    MESSAGE_STORAGE_KEYS: {
        settlementInfo: 'settlement_info',
        createRefundTxAndH: 'create_refund_tx_and_h',
        receiveHAndCreateRefundTx: 'receive_h_and_create_refund_tx',
        preImage: "preimage",
        hValue: "hvalue",
        submitHashLockTx: "submit_hash_lock_tx",
        lockTxHash: "lock_tx_hash",
        submitWithdrawTx: "submit_withdraw_tx",
        withdrawTxHash: "withdraw_tx_hash",
        submitRefundTx: 'submit_refund_tx',
        refundTxHash: "refund_tx_hash",
        submitApproveTx: 'submit_approve_tx',
        approveTxHash: 'approve_tx_hash',
        txComplete: 'tx_complete',
        locker: "locker",
        finalStatusNotify: 'final_status_notify'
    },

    KOFO_EVENT_TYPE: {
        signatureNotice: 'kofo_tx_signature',
        statusNotice: 'kofo_status_notice'
    },

    NOTICE_TYPE: {
        initSdk: 'init_sdk',
        settlementInfo: 'settlement_info',
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
        hashLockTxSign: 'hash_lock_tx_sign',
        withdrawTxSign: 'withdraw_tx_sign',
        refundTxSign: 'refund_tx_sign',
        approveTxSign: 'approve_tx_sign'
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