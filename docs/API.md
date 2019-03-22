## API
* #### Utils.createKofoId() 创建kofo公私钥对
    ```js
    //Create kofoId, pubkey, secret
    const obj = Utils.createkofoId();
    return:
    { kofoId: 'KOFOjNZSVTtXqSKtQNszQki6nHjt2F67GxqDeTqyBfM9nTuk',
      pubkey: '027590ba33bf9ec4afe5848b12faec5d5e7bc194f30f3ca29f121675d02b92d223',
      secret: 'dafd1ae95b8bb22617a05fcc022f65c53adf6ef26ece15ab69374538533033a6'
    }
    ```
* #### Utils.createPublicKey(secret`<String>`) 公钥转私钥
    ```js
    Utils.createPublicKey(kofo.secret);
    ```

* #### Utils.createKofoIdBySecret(secret`<String>`) 私钥转kofoId
    ```js
    Utils.createKofoIdBySecret(kofo.secret);
    ```

* #### Utils.createKofoIdByPubKey(publicKey`<String>`) 公钥转kofoId
    ```js
    Utils.createKofoIdByPubKey(kofo.pubkey);
    ```

* #### Utils.sign(secret`<String>`, data`<any>`) 椭圆曲线签名，在初始化sdk前
    ```js
    //Use secret for elliptic curve signature
    const signed = Utils.sign(kofo.secret, 'Hello world!');
    ```

* #### Utils.verifyWithKofoId(kofoId`<String>`, signature`<String>`, data`<any>`) 使用kofoId验证签名
    ```js
    //Verify signature with kofo id
    Utils.verifyWithKofoId(kofo.kofoId, signed, 'Hello world!')
    ```

* #### Utils.verifyWithPubKey(pubkey`<String>`, signature`<String>`, data`<any>`) 使用公钥验证签名
    ```js
    //Verify signature with public key
    Utils.verifyWithPubKey(kofo.pubkey, signed, 'Hello world!');
    ```

* #### Kofo.init(options<`Object`>) 初始化SDK
    `options` params
    * **mqUrl**        *`String required`*  Mqtt server url
    * **mqOptions**  *`Object required`*  Mqtt connection options
      * **username** *`String required`*  Mqtt server username
      * **password** *`String required`*  Mqtt server password
      * **kofoId** *`String required`*   kofo id
    * **gateway**    *`String required`*  Block chain gateway server url
    * **settlement** *`String required`*  Status server url
    * **insertData** *`Function required`*  Client provide data storage method, e.g: map `storage(key, value)`
    * **readData**   *`Function required`*  Client provide data reading method, e.g: `read(key)`
    * **cacheEncrypt**  *`Boolean Optional`* Encrypt cache data, default <u>`true`</u>
    ```js
    let dataMap = new Map();
    const insertData = function (key, value) {
        dataMap.set(key, value)
    };
    const readData = function (key) {
        return dataMap.get(key)
    };
    const kofo = Kofo.init(options);
    options:
        mqUrl: 'http://127.0.0.1:1883',
        mqOptions: {
            username: 'user',
            password: 'pwd',
            kofoId: 'kofo_sdk_client'
        },
        gateway: "http://gateway.com",
        settlement: "http://settlement.com",
        insertData: insertData,
        readData: readData,
        cacheEncrypt: false
    ```

* #### Kofo.signatureCallback(type, chain, currency, settlementId, signedRawTransaction) 交易签名后回调

    * **type** 签名事件类型
    * **chain** 交易对应链
    * **currency** 交易对应币种
    * **settlementId** 结算订单ID
    * **signedRawTransaction** 签名后的结果，`类型需要跟消息返回原类型一致`
    ```js
    const sign = function(tx){
        //调用对应链的签名算法进行签名
        return signHash(tx);
    }
    let signatureTxhandler = function(data){
        const {type, chain, currency, settlementId, publicKey, rawTransaction} = data;
        //等待客户端对该交易进行签名，并且回调到KOFO SDK
        //根据 chain, currency 字段实现不同链的签名，签名的字段是 rawTransaction
        //客户端在这里根据不同的场景可以实现同步或异步签名回调
        const signedRawTransaction = sign(rawTransaction);
        kofo.signatureCallback(type, chain, currency, settlementId, signedRawTransaction);
    }
    kofo.subscribe('kofo_tx_signature', signatureTxhandler);
    ```

* #### Kofo.subscribe(type`<String>`, listener`<Function>`) 消息订阅
    **1.kofo_tx_signature(交易签名事件)**
    返回数据:
    * **type** 签名事件类型
        * **`maker_hash_lock_tx_sign`**  Maker send hash lock transaction signature
        * **`taker_hash_lock_tx_sign`**  Taker send hash lock transaction signature
        * **`maker_withdraw_tx_sign`**   Maker send withdraw transaction signature
        * **`taker_withdraw_tx_sign`**   Taker send withdraw transaction signature
        * **`maker_refund_tx_sign`**    Maker send refund transaction signature
        * **`taker_refund_tx_sign`**    Taker send refund transaction signature
        * **`maker_approve_tx_sign`**  Maker send approve transaction signature (Erc20 token)
        * **`taker_approve_tx_sign`**  Taker send approve transaction signature (Erc20 token)
    * **chain** 交易对应链
        * ETH
        * EOS
        * Zilliqa
    * **currency** 交易对应币种
        * ETH
        * EOS
        * ZIL
    * **publicKey**  交易发起的公钥
    * **settlementId** 结算订单ID
    * **rawTransaction** 待签名对象，各个链的返回类型不一样，详情参照下面
        * ETH --> String
        * EOS --> Array
        * Zilliqa --> JSON String
    ```js
    let signatureTxhandler = function(data){
            //等待客户端对该交易进行签名，并且回调到KOFO SDK
            //根据 chain, currency 字段实现不同链的签名，签名的字段是 rawTransaction
            //客户端在这里根据不同的场景可以实现 同步 或者 异步 签名回调
    }
    kofo.subscribe('kofo_tx_signature', signatureTxhandler);
    ```

    **2.kofo_status_notice(各状态通知事件)**
    返回数据:
    * **init_sdk 初始化SDK**
        * **`type`** *init_sdk*
        * **`status`** *success, error, failed*
        * **`message`** Tip message
    * **settlement_info 结算订单信息**
        * **`type`** *settlement_info*
        * **`roleEnum`** *MAKER, TAKER*
        * **`settlementId`** 结算订单ID
        * **`chain`** 当前交易对应的链
        * **`currency`** 当前交易币种
        * ...
    * ===================**Apporve message(Erc20**=====================
    * **授权交易消息公共字段**
        * **`roleEnum`** *MAKER, TAKER*
        * **`settlementId`** 结算订单ID
        * **`chain`** 当前交易对应的链
        * **`currency`** 当前交易币种
        * **`amount`** 授权交易金额
        * **`pubKey`** 当前发起交易账号公钥
        * **`approveTx`** 创建授权交易返回对象
    * **pre_approve 发送授权交易前**
        * **`type`** *pre_approve*
    * **submit_approve 发送授权交易前**
        * **`type`** *submit_approve*
        * **`approveTxHash`** 授权交易Hash
    * **success_approve 发送授权交易前**
        * **`type`** *success_approve*
        * **`approveTxHash`** 授权交易Hash
    * **fail_approve 授权交易失败**
        * **`type`** *fail_approve*
        * **`approveTxHash`** 授权交易Hash
    * ===================**Hash lock message**=====================
    * **锁定交易消息公共字段**
        * **`roleEnum`** *MAKER, TAKER*
        * **`settlementId`** 结算订单ID
        * **`chain`** 当前交易对应的链
        * **`currency`** 当前交易币种
        * **`amount`** 授权交易金额
        * **`pubKey`** 当前发起交易账号公钥
        * **`lockTx`** 创建锁定交易返回对象(不同链内容不一样)
    * **pre_hash_lock 发送锁定交易前**
        * **`type`** *pre_hash_lock*
    * **submit_hash_lock** 锁定交易提交后**
        * **`type`** *submit_hash_lock*
        * **`lockTxHash`** 锁定交易Hash
    * **success_hash_lock 锁定交易成功**
        * **`type`** *success_hash_lock*
        * **`lockTxHash`** 锁定交易Hash
    * **fail_hash_lock 锁定交易失败**
        * **`type`** *fail_hash_lock*
        * **`lockTxHash`** 锁定交易Hash
    * ===================**Withdraw message**=====================
    * **提现交易消息公共字段**
        * **`roleEnum`** *MAKER, TAKER*
        * **`settlementId`** 结算订单ID
        * **`chain`** 当前交易对应的链
        * **`currency`** 当前交易币种
        * **`amount`** 授权交易金额
        * **`pubKey`** 当前发起交易账号公钥
        * **`withdrawTx`** 创建提现交易返回对象(不同链内容不一样)
    * **pre_withdraw 发送提现交易前**
        * **`type`** *pre_withdraw*
    * **submit_withdraw 提现交易提交后**
        * **`type`** *submit_withdraw*
        * **`withdrawTxHash`** 提现交易Hash
    * **success_withdraw 提现交易成功**
        * **`type`** *success_withdraw*
        * **`withdrawTxHash`** 提现交易Hash
    * **fail_withdraw 提现交易失败**
        * **`type`** *fail_withdraw*
        * **`withdrawTxHash`** 提现交易Hash
    * ===================**Refund message**=====================
    * **赎回交易消息公共字段**
        * **`roleEnum`** *MAKER, TAKER*
        * **`settlementId`** 结算订单ID
        * **`chain`** 当前交易对应的链
        * **`currency`** 当前交易币种
        * **`amount`** 授权交易金额
        * **`pubKey`** 当前发起交易账号公钥
        * **`refundTx`** 创建赎回交易返回对象(不同链内容不一样)
    * **pre_refund 发送赎回交易前**
        * **`type`** *pre_refund*
    * **submit_refund 赎回交易提交后**
        * **`type`** *submit_refund*
        * **`refundTxHash`** 赎回交易Hash
    * **success_refund 赎回交易成功**
        * **`type`** *success_refund*
        * **`refundTxHash`** 赎回交易Hash
    * **fail_refund 赎回交易失败**
        * **`type`** *fail_refund*
        * **`refundTxHash`** 赎回交易Hash
    * ===================**Complete message**=====================
    * **complete 订单完结**
        * **`type`** *complete*
        * **`roleEnum`** *MAKER, TAKER*
        * **`settlementId`** 结算订单ID
        * **`chain`** 当前交易对应的链
        * **`currency`** 当前交易币种
    ```js
    function listener(data){
        //do something
    }
    kofo.subscribe('kofo_status_notice', listener);
    ```

* #### client存储数据和KEY定义
    `roleEnum = maker | taker`
    * `{settlementId}_maker_preimage`  ***<u>`String`</u>***
    * `{settlementId}_{roleEnum}_settlement_info`  ***<u>`Object`</u>***
    * `{settlementId}_{roleEnum}_create_refund_tx_and_h_locker`       ***<u>`Boolean`</u>***
    * `{settlementId}_{roleEnum}_hvalue` ***<u>`String`</u>***
    * `{settlementId}_{roleEnum}_submit_hash_lock_tx_locker` ***<u>`Boolean`</u>***
    * `{settlementId}_{roleEnum}_submit_hash_lock_tx` ***<u>`Object`</u>***
    * `{settlementId}_{roleEnum}_lock_tx_hash` ***<u>`Object`</u>***
    * `{settlementId}_{roleEnum}_submit_withdraw_tx_locker` ***<u>`Boolean`</u>***
    * `{settlementId}_{roleEnum}_submit_withdraw_tx` ***<u>`Object`</u>***
    * `{settlementId}_{roleEnum}_withdraw_tx_hash` ***<u>`Object`</u>***
    * `{settlementId}_{roleEnum}_submit_refund_tx_locker` ***<u>`Boolean`</u>***
    * `{settlementId}_{roleEnum}_submit_refund_tx` ***<u>`Object`</u>***
    * `{settlementId}_{roleEnum}_refund_tx_hash` ***<u>`Object`</u>***
    * `{settlementId}_{roleEnum}_submit_approve_tx_locker` ***<u>`Boolean`</u>***
    * `{settlementId}_{roleEnum}_submit_approve_tx` ***<u>`Object`</u>***
    * `{settlementId}_{roleEnum}_approve_tx_hash` ***<u>`Object`</u>***
    * `{settlementId}_{roleEnum}_tx_complete` ***<u>`Boolean`</u>***

* #### NOTE:
    为了安全性建议客户端需对sdk通过insertData返回的数据做持久化存储或者加密处理，SDK不会对用户的私钥或者任何敏感数据进行存储和传播
