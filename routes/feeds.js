var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');
var APIHelper = require("../lib/APIHelper.js");
var Lazada = require("../config/lazada.js");
var auth = require("../lib/auth.js");

router.all('/*', auth.authenticate('admin'));
/*
 * Lấy danh sách sản phẩm database
 * */
router.get('/', function (req, res, next) {

    res.render('products/list', {
        title: 'Products',
        desc: 'List'
    });
});

router.get('/feedcount', function (req, res, next) {
    var async = res;
    var parameters = {
        UserID: Lazada.api_user,
        Version: Lazada.api_version,
        Action: 'FeedCount',
        Format: 'JSON',
        Timestamp: new Date().toISOString()
    };

    var queryString = APIHelper.queryString(parameters);

    var optionsget = {
        host: Lazada.api_host,
        path: '/?' + queryString,
        method: 'GET' // do GET
    };

    var reqGet = https.request(optionsget, function (res) {
        //console.log("statusCode: ", res.statusCode);
        // console.log("headers: ", res.headers);
        res.setEncoding('utf-8');
        var responseString = '';
        res.on('data', function (d) {
            console.info('GET result:\n');
            //process.stdout.write(d);
            responseString += d;
            console.info('\n\nCall completed');
        });

        res.on('end', function () {
            var responseObject = JSON.parse(responseString);
            if(responseObject.SuccessResponse){
                // var data = responseObject.SuccessResponse.Body.Products.Product;
                // var arr = [];
                // data.forEach(function (item, index) {
                //     arr.push(item.SellerSku);
                //     //async.send(item.SellerSku);
                // });
                // console.log('so luong : ' + arr.length);
                async.send(responseObject);
            }else{
                async.send('Error.');
            }
        });
    });

    reqGet.end();
    reqGet.on('error', function (e) {
        console.error(e);
    });

    // async.render('products/list',{
    //     title: 'Products',
    //     desc: 'List'
    // });
});
module.exports = router;