module.exports = {
    KOFO_PREFIX: 'KOFO',

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
        SETTLEMENT_INFO: 'settlement_info',
        CREATE_REFUND_TX_AND_H: 'create_refund_tx_and_h',
        RECEIVE_H_AND_CREATE_REFUND_TX: 'receive_h_and_create_refund_tx',
        PRE_IMAGE: 'preimage',
        H_VALUE: 'hvalue',
        SUBMIT_HASH_LOCK_TX: 'submit_hash_lock_tx',
        LOCK_TX_HASH: 'lock_tx_hash',
        SUBMIT_WITHDRAW_TX: 'submit_withdraw_tx',
        WITHDRAW_TX_HASH: 'withdraw_tx_hash',
        SUBMIT_REFUND_TX: 'submit_refund_tx',
        REFUND_TX_HASH: 'refund_tx_hash',
        SUBMIT_APPROVE_TX: 'submit_approve_tx',
        APPROVE_TX_HASH: 'approve_tx_hash',
        TX_COMPLETE: 'tx_complete',
        LOCKER: 'locker',
        FINAL_STATUS_NOTIFY: 'final_status_notify'
    },

    KOFO_EVENT_TYPE: {
        SIGNATURE_NOTICE: 'kofo_tx_signature',
        STATUS_NOTICE: 'kofo_status_notice'
    },

    NOTICE_TYPE: {
        INIT_SDK: 'init_sdk',
        SETTLEMENT_INFO: 'settlement_info',
        PRE_HASH_LOCK: 'pre_hash_lock',
        SUBMIT_HASH_LOCK: 'submit_hash_lock',
        SUCCESS_HASH_LOCK: 'success_hash_lock',
        FAIL_HASH_LOCK: 'fail_hash_lock',
        PRE_WITHDRAW: 'pre_withdraw',
        SUBMIT_WITHDRAW: 'submit_withdraw',
        SUCCESS_WITHDRAW: 'success_withdraw',
        FAIL_WITHDRAW: 'fail_withdraw',
        PRE_REFUND: 'pre_refund',
        SUBMIT_REFUND: 'submit_refund',
        SUCCESS_REFUND: 'success_refund',
        FAIL_REFUND: 'fail_refund',
        PRE_APPROVE: 'pre_approve',
        SUBMIT_APPROVE: 'submit_approve',
        SUCCESS_APPROVE: 'success_approve',
        FAIL_APPROVE: 'fail_approve',
        COMPLETE: 'complete'
    },

    SIGN_CALLBACK_TYPE: {
        HASH_LOCK_TX_SIGN: 'hash_lock_tx_sign',
        WITHDRAW_TX_SIGN: 'withdraw_tx_sign',
        REFUND_TX_SIGN: 'refund_tx_sign',
        APPROVE_TX_SIGN: 'approve_tx_sign'
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