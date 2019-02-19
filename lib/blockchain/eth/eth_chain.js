const {utils} = require("ethers");
class EthChain {
    publicToAddress(pubKey){
       return utils.computeAddress(pubKey)
    }
}
module.exports = EthChain;