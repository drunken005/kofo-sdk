const client = require('./client');


const privateKey = {
    ETH: '02DB31472EB7FF0F42C8E815BFAA541CE563AA894CB3A66E4C6616427A6BD954',
    EOS: '5JSRAcfALhELVvTK59umFEXSzY4MkBCL3SPajSZw1BqHyoLtH79'
};
const kofoId = '023fbf8ded0155ef73b25c19e20a4a92f984ffe621e8d1b0a2572e593469c1016e';
const clean = true;

client.run(privateKey, kofoId, clean);


