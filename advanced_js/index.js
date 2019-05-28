const request = require('request');
const http = require('http');
//const cryptocoin = require('./cryptocoin.js')

http.createServer((req, res) => {
    res.writeHeader(200, { 'Content-Type': 'text/plain'});
    if (coins){
        res.end(JSON.stringify(coins));
    } else {
        res.end('No data');
    }
}).listen(8080);
