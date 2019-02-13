// class Base {
//     constructor(config, amount){
//         this.name = config.name;
//         this.address = config.address;
//         this.amount = amount;
//     }
//     printName(){
//         console.log('name:  ',this.name);
//     }
//
//
//     printAddress(){
//         console.log('address:  ',this.address);
//     }
//
//     printAmount(){
//         console.log('amount:  ',this.amount);
//     }
//
//     signs(){
//         let sign = this.sign();
//     }
// }
//
//
//
// class Eos extends Base{
//     constructor(){
//         let args  = Array.prototype.slice.apply(arguments);
//         super(...args);
//     }
//
//     printName(){
//         console.log('.............................................EOS NAME: ', this.name);
//     }
//
//     sign(){
//         return 'SIGN_EOS....';
//     }
// }
//
// class Eth extends Base{
//     constructor(config, amount){
//         super(config, amount);
//     }
//
//     sign(){
//         return 'SIGN_ETH....';
//     }
// }
//
//
// let eos = new Eos({name:'EOS', address:'EOS02b7a149d628d9327a6c2db12cc21293c795480404877988d947e86f86874c7522'},'200 EOS');
// eos.printName();
// eos.printAddress();
// eos.printAmount();
//
// console.log('\n');
//
// let eth = new Eth({name:'ETH', address:'0xa2d3659ec26800498b2dd82cba0fe7d7a4637e743e5f4aaf55aac273c29c24e9a6a0748fcea2bb9dfece319eb454639778e02e67f02696afa9808dc593b08d2f'},'1000 ETH');
// eth.printName();
// eth.printAddress();
// eth.printAmount();

// const utils = require('./lib/utils/utils');
//
//
//
// let preImage = utils.createPreImage();
// console.log(preImage);
//
// // let hValue = utils.sha256Twice(preImage);
// function Parent(name) {
//     this.name = name;
//     this.age = '1213';
// }
//
// Parent.prototype.sayName  = function () {
//     console.log(this.name)
// };
// // var iParent = new Parent('james')
// // iParent.sayName()
//
// function Child(name) {
//     Parent.call(this, name);
//     // this.name = name;
//     // this.parent = Parent
//     // this.parent(name)
//     // // delete this.parent
//     // this.saySome = function() {
//     //     console.log('my name: ' + this.name)
//     //     this.sayName()
//     // }
// }
// Child.prototype=new Parent;
//
// Child.prototype.sayHello = function(){
//     this.sayName();
// };
//
//
// let ch = new Child('zhangsan');
// //
// // console.log(ch.name);
// // console.log(ch);
// ch.sayName();
// ch.sayHello();


// let MQ_MESSAGE_TYPE = {
//     makerCreateRefundTxAndH: "maker_create_refund_tx_and_h",
//     takerReceiveHAndCreateRefundTx: "taker_receive_h_and_create_refund_tx",
//
//     makerSubmitHashLockTx: "maker_submit_hash_lock_tx",
//     takerSubmitHashLockTx: "taker_submit_hash_lock_tx",
//
//     makerSubmitWithdrawTx: "maker_submit_withdraw_tx",
//     takerSubmitWithdrawTx: "taker_submit_withdraw_tx",
//
//     // makerSubmitRefundTx: 'maker_submit_refund_tx',
//     // takerSubmitRefundTx: 'taker_submit_refund_tx',
//     //
//     // makerSubmitApproveTx: 'maker_submit_approve_tx',
//     // takerSubmitApproveTx: 'taker_submit_approve_tx',
//     //
//     //
//     // makerPreImage: "maker_preimage",
//     // makerHValue: "maker_hvalue",
//     // makerPublicKey: "maker_public_key",
//     //
//     // makerCounterChainPublicKey: "maker_counter_chain_public_key",
//     // takerPublicKey: "taker_public_key",
//     // takerCounterChainPublicKey: "taker_counter_chain_public_key",
//     // takerHValue: "taker_hvalue",
//     //
//     // makerLockTxHash: "maker_lock_tx_hash",
//     // takerLockTxHash: "taker_lock_tx_hash",
//     //
//     // makerWithdrawTxHash: "maker_withdraw_tx_hash",
//     // takerWithdrawTxHash: "taker_withdraw_tx_hash",
//     //
//     // makerRefundTxHash: "maker_refund_tx_hash",
//     // takerRefundTxHash: "taker_refund_tx_hash",
//     //
//     // makerApproveTxHash: 'maker_approve_tx_hash',
//     // takerApproveTxHash: 'taker_approve_tx_hash',
//     //
//     // locker: "locker"
//
// };
//
// const _ = require('lodash');
// let values = _.map(MQ_MESSAGE_TYPE, (v, k) => {
//     return v.split('_').slice(1).join('_')
// });
//
// console.log(_.uniq(values));

// console.log(MQ_MESSAGE_TYPE);

// let keys = _.keys(MQ_MESSAGE_TYPE), values = _.values(MQ_MESSAGE_TYPE);

// console.log(keys, values)
// const table = require('./cli_table');

// let s = table(keys, values);

// console.log(s);

// let keys1 = _.keys(MQ_MESSAGE_TYPE), values1 = _.values(MQ_MESSAGE_TYPE);
//
// let vv = values1.unshift(keys1);
// console.log(vv);
// const util = require('util');
//
// const valuesKey = 'Values';
// const indexKey = '(index)';
//
//
// let ctable = function(tabularData, properties) {
//     const inspect = (v) => {
//         const depth = v !== null &&
//         typeof v === 'object' &&
//         !isArray(v) &&
//         _.keys(v).length > 2 ? -1 : 0;
//         const opt = {
//             depth,
//             maxArrayLength: 3
//         };
//         return util.inspect(v, opt);
//     };
//
//
//     const map = {};
//     let hasPrimitives = false;
//     const valuesKeyArray = [];
//     const indexKeyArray = _.keys(tabularData);
//
//     for (let i =0; i < indexKeyArray.length; i++) {
//         const item = tabularData[indexKeyArray[i]];
//         const primitive = item === null ||
//             (typeof item !== 'function' && typeof item !== 'object');
//         if (properties === undefined && primitive) {
//             hasPrimitives = true;
//             valuesKeyArray[i] = inspect(item);
//         } else {
//             const keys = properties || _.keys(item);
//             for (const key of keys) {
//                 if (map[key] === undefined)
//                     map[key] = [];
//                 // console.log(hasOwnProperty(item, key))
//                 if ((primitive && properties) || !item.hasOwnProperty(key))
//                     map[key][i] = '';
//                 else
//                     map[key][i] = item == null ? item : inspect(item[key]);
//             }
//         }
//     }
//     console.log(map)
//
//     const keys = _.keys(map);
//     const values = _.values(map);
//     if (hasPrimitives) {
//         keys.push(valuesKey);
//         values.push(valuesKeyArray);
//     }
//     keys.unshift(indexKey);
//     values.unshift(indexKeyArray);
//     // console.log(keys, values);
//     let a = table(keys, values)
//     console.log(a);
// };

// const {tableStr} = require('./lib/utils/cache_util');
// const fs = require('fs');
// const moment = require('moment');
// const path = require('path');
// let logPath = path.join(process.env.PROJECT_DIR, 'logs',[moment(new Date()).format('YYYY-MM-DD'),'log'].join('.'));
//
// console.log(logPath);
// let str = 'Test aaaaaa \n';
//
// str += tableStr([MQ_MESSAGE_TYPE]);
//
//
// fs.appendFileSync(logPath, str)
//
// console.log(str);
//
//
// const moment = require('moment');
//
// console.log(moment(new Date()).format('YYYY-MM-DD'))


// const EventEmitter = require('events');
//
//
// let e =  new EventEmitter();
//
// e.addListener('drunken', console.log);
//
// e.emit('drunken', {type:'number', name:'drunken'})
//
// e.emit('drunken', {type:'string', name:'bruce'})


const {Wallet: __wallet__, utils, getDefaultProvider} = require("ethers");


let wallet = new __wallet__('02DB31472EB7FF0F42C8E815BFAA541CE563AA894CB3A66E4C6616427A6BD954');
console.log(wallet)


// let address = utils.computeAddress('0x0421caaf99e3f0069b7889e2ebed593e2daa4d1f01575e1469787abcf02bbc012ee62e020037be4e944edf2a24d589dba389bd3a61df6f2bbc146abda7f39f69a9');

// let transaction = {
//     nonce: 1,
//     gasLimit: 21000,
//     gasPrice: 20000000000,
//
//     to: "0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290",
//     // ... or supports ENS names
//     // to: "ricmoo.firefly.eth",
//
//     value:1.0,
//     data: "0x",
//
//     // This ensures the transaction cannot be replayed on different networks
//     chainId: utils.getNetwork('homestead').chainId
// }
// console.log(transaction);

// let signPromise = wallet.sign(transaction)
//
// signPromise.then((signedTransaction) => {
//
//     console.log(signedTransaction);
//     // "0xf86c808504a817c8008252089488a5c2d9919e46f883eb62f7b8dd9d0cc45bc2
//     //    90880de0b6b3a76400008025a05e766fa4bbb395108dc250ec66c2f88355d240
//     //    acdc47ab5dfaad46bcf63f2a34a05b2cb6290fd8ff801d07f6767df63c1c3da7
//     //    a7b83b53cd6cea3d3075ef9597d5"
//
//     // This can now be sent to the Ethereum network
//     let provider = getDefaultProvider()
//     provider.sendTransaction(signedTransaction).then((tx) => {
//
//         console.log(tx);
//         // {
//         //    // These will match the above values (excluded properties are zero)
//         //    "nonce", "gasLimit", "gasPrice", "to", "value", "data", "chainId"
//         //
//         //    // These will now be present
//         //    "from", "hash", "r", "s", "v"
//         //  }
//         // Hash:
//     });
// })
//
//



// console.log(xzs.raw);

// let tx = utils.parseTransaction('0xf88d02847735940083033450945502a0576e14e839cf72817f2ef15c3473b5ebd8872386f26fc10000b864a80de0e80000000000000000000000005c7c9e06cf9faf957fc950887978a9434d0b5abb0dd8c357e19c231a05b718cfeb2e576a847c113b97eff324fe87a05732f72e1800000000000000000000000000000000000000000000000000000000003b0395');
// console.log(tx);
// async function s() {
//     console.log('sign.........................');
//     let signed = await wallet.sign(tx);
//     console.log(signed)
// }
//
// s().catch(console.log)