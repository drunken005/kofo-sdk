const client = require('./client');


const privateKey = '07FED02BDB20EFE5297445472E2AD0647C9E288A5E28A4E0C7C18CEEFC09B470';
const kofoId = '02a95024e899468bbe2e091444cd01366b141f1209faef9a3cf76eeb383b7dcfe1';
const clean = true;

client.run(privateKey,kofoId, clean);


