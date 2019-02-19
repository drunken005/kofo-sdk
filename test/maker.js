const client = require('./client');
const privateKey = {
    ETH: '07FED02BDB20EFE5297445472E2AD0647C9E288A5E28A4E0C7C18CEEFC09B470',
    EOS: '5JA4QNHpf1HjwAP6SK4MdrWnb2SBAAxrXN5tNfZe6zL1Je7s1MZ'
};
const kofoId = '02a95024e899468bbe2e091444cd01366b141f1209faef9a3cf76eeb383b7dcfe1';
const clean = true;

client.run(privateKey, kofoId, clean, 'maker');


