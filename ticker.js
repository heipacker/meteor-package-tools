// Price ticker
MoacTools.ticker = new Mongo.Collection('moac_price_ticker', {connection: null});
if (Meteor.isClient) {
    new PersistentMinimongo(MoacTools.ticker);
}
var urlPrefix = "https://localhost:8887";

MoacTools.ticker.start = function (options) {
    options = options || {};
    if (!options.currencies) {
        options.currencies = ['BTC', 'USD', 'EUR'];
    }
    var url = urlPrefix + '/data/price?fsym=MOAC&tsyms=' + options.currencies.join(',');
    if (options.extraParams) {
        url += '&extraParams=' + options.extraParams;
    }

    var updatePrice = function (e, res) {

        if (!e && res && res.statusCode === 200) {
            var content = JSON.parse(res.content);

            if (content) {
                _.each(content, function (price, key) {
                    var name = key.toLowerCase();

                    // make sure its a number and nothing else!
                    if (_.isFinite(price)) {
                        MoacTools.ticker.upsert(name, {
                            $set: {
                                price: String(price),
                                timestamp: null
                            }
                        });
                    }

                });
            }
        } else {
            console.warn('Can not connect to ' + urlPrefix + ' to get price ticker data, please check your internet connection.');
        }
    };

    // update right away
    HTTP.get(url, updatePrice);

    // update prices
    Meteor.setInterval(function () {
        HTTP.get(url, updatePrice);
    }, 1000 * 30);
}
