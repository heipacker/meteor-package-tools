

Tinytest.add('MoacTools.toWei', function (test) {

    // set BTC price
    MoacTools.ticker.update('btc', {$set: {
        price: '0.01230'
    }});

    test.equal(MoacTools.toWei(0.025, 'btc'),  "2032520325203252033");
    test.equal(MoacTools.toWei(0.02554351, 'btc'),  "2076708130081300813");

    // set EUR price
    MoacTools.ticker.update('eur', {$set: {
        price: '3.12344'
    }});

    test.equal(MoacTools.toWei(6.247, 'eur'),  "2000038419178854084");
    test.equal(MoacTools.toWei(6.24688, 'eur'),  "2000000000000000000");
    test.equal(MoacTools.toWei('3.7481279999999999042', 'eur'),  "1199999999999999969");
});

Tinytest.add('MoacTools.formatNumber', function (test) {
    test.equal(MoacTools.formatNumber('1000000000000000000', '0,0.0[00]'),  "1,000,000,000,000,000,000.0");
    test.equal(MoacTools.formatNumber('11234565.4565432', '0,0.0[00]'),  "11,234,565.457");
});

Tinytest.add('MoacTools.formatBalance', function (test) {

    // default to ether
    if(Meteor.isClient)
        MoacTools.setUnit('ether');
    test.equal(MoacTools.formatBalance('1000000000000000000', '0,0.0[00] unit'), "1.0 ether");

    // default to finney
    if(Meteor.isClient) {
        MoacTools.setUnit('finney');
        test.equal(MoacTools.formatBalance('1000000000000000000', '0,0.0[00] unit'), "1,000.0 finney");

        test.equal(MoacTools.formatBalance('100000000000000000', '0,0.0[00] UNIT'), "100.0 FINNEY");
    }

    test.equal(MoacTools.formatBalance('1000000000000000000', '0,0.0[00] unit', 'gwei'), "1,000,000,000.0 gwei");

    test.equal(MoacTools.formatBalance('112345676543212345', '0,0.0[00] UNIT', 'gwei'), "112,345,676.543 GWEI");

    test.equal(MoacTools.formatBalance('112345676543212345', '0,0.0[0000]', 'gwei'), "112,345,676.54321");


    // set BTC price
    MoacTools.ticker.update('btc', {$set: {
        price: '0.01230'
    }});

    test.equal(MoacTools.formatBalance('2000000000000000000', '0,0.0[00]', 'btc'), "0.025");
    test.equal(MoacTools.formatBalance('2000000000000000000', '0,0.0[00] unit', 'btc'), "0.025 btc");
    test.equal(MoacTools.formatBalance('2000000000000000000', '0,0.0[00]unit', 'btc'), "0.025btc");

    MoacTools.ticker.update('btc', {$set: {
        price: '0.1'
    }});

    test.equal(MoacTools.formatBalance('1000000000000000000', '0,0.0000000000000000000', 'btc'), "0.1000000000000000056");

    // set EUR price
    MoacTools.ticker.update('eur', {$set: {
        price: '3.12344'
    }});

    test.equal(MoacTools.formatBalance('1200000000000000012', '0,0.0000000000000000000', 'eur'), "3.7481279999999999042");
    test.equal(MoacTools.formatBalance('2000000000000000000', '0,0.0[00]', 'eur'), "6.247");
    test.equal(MoacTools.formatBalance('2000000000000000000', '0,0.0[00] UNIT', 'eur'), "6.247 EUR");
    test.equal(MoacTools.formatBalance('2000000000000000000', '0,0.0[0000]UNIT', 'eur'), "6.24688EUR");

    MoacTools.ticker.update('eur', {$set: {
        price: '1.00000'
    }});

    test.equal(MoacTools.formatBalance('1000000000000000000', '0,0.0000000000000000000', 'eur'), "1.0000000000000000000");

    // reset
    if(Meteor.isClient)
        MoacTools.setUnit('ether');

});