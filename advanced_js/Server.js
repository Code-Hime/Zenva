const http = require('http');
const request = require('request');
const url = require('url');
const cryptocoin = require('./cryptocoin.js');

exports.Server = class {
    constructor(port) {
        this.port = port;
        this.coins = [];

        http.createServer((req, res) => {
            res.writeHeader(200, { 'Content-Type': 'text/plain'});
            
            const url_query = url.parse(req.url, true).query;
            const coin1_name = url_query.from;
            const coin2_name = url_query.to;

            let coin1 = undefined;
            let coin2 = undefined;

            this.coins.forEach((coin) => {
                if (coin.id === coin1_name) {
                    coin1 = coin;
                }
                else if (coin.id === coin2_name) {
                    coin2 = coin;
                }
            });

            if (coin1 && coin2) {
                const conversion_factor = coin1.convert_to(coin2);
                res.end(coin1.name + ' costs ' + conversion_factor + ' ' + coin2.name + 's');
            }
            else {
                res.end('Could not find matching coins')
            }
        }).listen(this.port);

        const requestOptions = {
            method: 'GET',
            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
            headers: {
                'X-CMC_PRO_API_KEY': '33260253-fe40-4119-8717-034fd116b970'
            },
            json: true,
            gzip: true
        };

        request(requestOptions, (err, request_res, body) => {
            if (err) throw err;
        
            let coin_data = body.data;
            console.log(coin_data);
            coin_data.forEach((coin) => this.coins.push(new cryptocoin.Cryptocoin(coin.slug, coin.name, coin.quote.USD.price)));
        }); 
    }
}
