const {utils} = require("ethers");
class EthChain {
    publicToAddress(pubKey){
       // return utils.computeAddress(pubKey)
        return pubKey;
    }
}
module.exports = EthChain;