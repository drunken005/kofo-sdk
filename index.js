const Kofo = require('./lib/kofo');
const {createKofoId, createKofoIdByPubKey, sign, verifyWithPubKey, verifyWithKofoId} = require('./lib/utils/utils');
const Utils = {
    createKofoId,
    createKofoIdByPubKey,
    sign,
    verifyWithPubKey,
    verifyWithKofoId
};

module.exports = {Kofo, Utils};