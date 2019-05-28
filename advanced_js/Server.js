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
 