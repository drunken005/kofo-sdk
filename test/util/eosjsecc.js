const ecc = require('eosjs-ecc');

function privateToPublic(privateKey) {
    let publicKey = ecc.privateToPublic(privateKey);
    console.log('============ publicKey ====     ');
    console.log(publicKey);
    console.log('\n');
    return publicKey
}


function signHash(signHash, privateKey) {
    let signed = ecc.signHash(signHash, privateKey);
    console.log('============ signed hash ====     ');
    console.log(signed);
    console.log('\n');
    return signed;
}

// Create a new random private key
async function createKey() {
    let privateKey = await ecc.PrivateKey.randomKey();
    privateKey = privateKey.toWif();

    let publicKey = ecc.PrivateKey.fromString(privateKey).toPublic().toString();
    console.log('============ created keys ====     ');
    console.log({privateKey, publicKey});
    console.log('\n');
    return {privateKey, publicKey};
}

// createKey().catch(console.log);
// privateToPublic('5JA4QNHpf1HjwAP6SK4MdrWnb2SBAAxrXN5tNfZe6zL1Je7s1MZ');
// signHash('18a994888d6c5325faa35c1ca57c425900a5cc12470f04f475e3a686321fea9f', '5JA4QNHpf1HjwAP6SK4MdrWnb2SBAAxrXN5tNfZe6zL1Je7s1MZ');
