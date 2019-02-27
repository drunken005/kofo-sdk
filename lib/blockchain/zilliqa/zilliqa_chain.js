const EtherUtil = require('ethereumjs-util');

class ZilliqaChain {
    publicToAddress(pubKey, network){
        // if (pubKey.substr(0, 2) === '0x') {
        //     pubKey = pubKey.substr(2);
        // }
        // let address = EtherUtil.publicToAddress(Buffer.from(pubKey, 'hex'));
        // return '0x' + address.toString('hex');
        return pubKey;
    }
}

module.exports = ZilliqaChain;