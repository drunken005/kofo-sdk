const EtherUtil = require('ethereumjs-util');
const {Wallet: __wallet__, utils, getDefaultProvider} = require("ethers");

class EthChain {
    publicToAddress(pubKey, network){
        // if (pubKey.substr(0, 2) === '0x') {
        //     pubKey = pubKey.substr(2);
        // }
        // let address = EtherUtil.publicToAddress(Buffer.from(pubKey, 'hex'));
        // return '0x' + address.toString('hex');

       return utils.computeAddress(pubKey)
    }
}

module.exports = EthChain;


let add = new EthChain().publicToAddress('0x0421caaf99e3f0069b7889e2ebed593e2daa4d1f01575e1469787abcf02bbc012ee62e020037be4e944edf2a24d589dba389bd3a61df6f2bbc146abda7f39f69a9');
console.log(add)