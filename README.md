# KOFO SDK APIS
## Install and import

```$xslt
npm install kofo-sdk --save
```
```$xslt
const KOFO = require('kofo-sdk');

import KOFO from 'kofo-sdk';
``` 
## APIS
### *Kofo.createKofoId* 生成kofoId 和 secret
e.g
```$xslt
const obj = Kofo.createkofoId();
return:
{ kofoId: '032557ae0441f8674a14100c4eed25ba4b50cc0c6b083c1fa15da82d02318486a3',
  secret: '8bf218ba7311136ce81659e970c3a5dd6db567c8ab83d88b5989c37e5c53a49e' 
}
```

### *Kofo.init* 初始化SDK
**`Kofo.init`** params **options：**
* **mqUrl**        *`String required`*  Mqtt server url
* **mqOptions**  *`Object required`*  Mqtt connection options
  * **username** *`String required`*  Mqtt server username
  * **password** *`String required`*  Mqtt server password
  * **kofoId** *`String required`*   kofo id
* **gateway**    *`String required`*  Block chain gateway server url
* **settlement** *`String required`*  Status server url
* **insertData** *`Function required`*  Client provide data storage method, e.g: map `storage(key, value)`
* **readData**   *`Function required`*  Client provide data reading method, e.g: `read(key)`

e.g

```$xslt
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
    readData: readData
```

### *Kofo.signatureCallback* 交易签名回调
**params**
* **type** 签名事件类型
* **chain** 交易对应链
* **currency** 交易对应币种
* **settlementId** 结算订单ID
* **signedRawTransaction** 签名后的结果，`类型需要跟消息返回原类型一致`

e.g
```bash
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

### *Kofo.subscribe* 消息订阅
#### 消息类型:
##### 1.kofo_tx_signature(交易签名事件)
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
    
e.g
```bash
let signatureTxhandler = function(data){
        //等待客户端对该交易进行签名，并且回调到KOFO SDK
        //根据 chain, currency 字段实现不同链的签名，签名的字段是 rawTransaction
        //客户端在这里根据不同的场景可以实现 同步 或者 异步 签名回调
}
kofo.subscribe('kofo_tx_signature', signatureTxhandler);
```

##### 2.kofo_status_notice(各状态通知事件)
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
* ========================================**Apporve message(Erc20)**==============================================
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
* ========================================**Hash lock message**===================================================
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
* ========================================**Withdraw message**====================================================
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
* ========================================**Refund message**=====================================================
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
* ========================================**Complete message**=====================================================
* **complete 订单完结**
    * **`type`** *complete*
    * **`roleEnum`** *MAKER, TAKER*
    * **`settlementId`** 结算订单ID
    * **`chain`** 当前交易对应的链
    * **`currency`** 当前交易币种
    
e.g
```bash
function listener(data){
    //do something
}
kofo.subscribe('kofo_status_notice', listener);
```

* * *
## client存储数据和KEY定义

#### `roleEnum = maker | taker`

* `{settlementId}_maker_preimage`                          ***<u>`String`</u>***
* `{settlementId}_{roleEnum}_settlement_info`             ***<u>`Object`</u>***
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


* * *


ps:
为了安全性建议客户端需对sdk通过insertData返回的数据做持久化存储或者加密处理，SDK不会对用户的私钥或者任何敏感数据进行存储和传播

* * *
## 版本记录
| Version | Date |
| --- | --- |
| 1.0.0 | 2019.2.2 |
| 1.0.1 | 2019.2.11 |
| 1.0.2 | 2019.2.12 |
| 1.0.3 | 2019.2.15 |
| 1.0.4 | 2019.2.19 |