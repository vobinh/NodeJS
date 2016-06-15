var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');
var APIHelper = require("../lib/APIHelper.js");
var Lazada = require("../config/lazada.js");
var auth = require("../lib/auth.js");
var async = require("async");
var Models = require("../models/models.js");

router.all('/*', auth.authenticate('admin'));
/*
 * Get order list
 * */
router.get('/', function (req, res) {
    Models.Order.find({})
        .exec( function (err, orders){
            if(err){
                res.send('error has occurred.');
            }else{
                res.render('orders/list', {
                    title: 'Orders',
                    desc: 'List',
                    data: orders
                });
            }
        });

});
/*
* Lấy danh sách order lazada
* */
router.get('/getorders', function (req, res) {

    var parameters = {
        UserID: Lazada.api_user,
        Version: Lazada.api_version,
        Action: 'GetOrders',
        //Status: 'pending',
        Format: 'JSON',
        Timestamp: new Date().toISOString()
    };

    var queryString = APIHelper.queryString(parameters);

    var optionsget = {
        host: Lazada.api_host,
        path: '/?' + queryString,
        method: 'GET' // do GET
    };

    async.waterfall([
        function (callback) {
            var reqGet = https.request(optionsget, function (resp) {
                resp.setEncoding('utf-8');
                var responseString = '';
                resp.on('data', function (d) {
                    responseString += d;
                    console.info('\nCall completed');
                });

                resp.on('end', function () {
                    var responseObject = JSON.parse(responseString);
                    callback(null, responseObject);
                });
            });

            reqGet.end();
            reqGet.on('error', function (e) {
                callback(e, null);
                return;
            });
        }
    ], function (err, result) {
        if(err){
            console.error(e);
            return;
        }
        if(result.SuccessResponse){
            console.log(result);
            result = result.SuccessResponse.Body.Orders.Order;
            result.forEach(function (item, index) {
                var data = new Models.Order();
                data.OrderId= item.OrderId;
                data.Name= item.Name;
                data.CustomerFirstName= item.CustomerFirstName;
                data.CustomerLastName = item.CustomerLastName;
                data.OrderNumber= item.OrderNumber;
                data.PaymentMethod= item.PaymentMethod;
                data.Remarks= item.Remarks;
                data.DeliveryInfo= item.DeliveryInfo;
                data.Price= parseFloat(item.Price|0);
                data.GiftMessage= item.GiftMessage;
                data.VoucherCode= item.VoucherCode;
                data.CreatedAt= item.CreatedAt;
                data.UpdatedAt= item.UpdatedAt;
                data.ItemsCount= parseInt(item.ItemsCount|0);

                var st = item.Statuses.Status;
                var arr_st = [];
                if(st){
                    if(typeof st === 'string'){
                        var item_st = {
                            Status: st.toString()
                        };
                        arr_st.push(item_st);
                    }else if(typeof st === 'object'){
                        for (var i = 0; i < st.length; i++) {
                            var item_st = {
                                Status: st[i]
                            };
                            arr_st.push(item_st);
                        };
                    }
                }
                data.Statuses = arr_st;
                data.save(function (error) {
                    console.log("***************************");
                    console.log(index);
                    console.log("***************************");
                    if (error) {
                        console.error(error);
                    }
                });
            });

            res.send('complete');
        }else{
            console.error(result);
            res.send(result);
        }
    });
});

/*
* Lấy 1 order lazada
* */
router.get('/:id/getorder', function (req, res, next) {
    var async = res;
    var parameters = {
        UserID: Lazada.api_user,
        Version: Lazada.api_version,
        Action: 'GetOrder',
        OrderId: req.params.id,
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
            responseString += d;
            console.info('\nCall completed');
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
                //console.log('so luong : ' + arr.length);
                //async.send(responseObject);
            }else{
                //async.send('Error.');
            }
            async.send(responseObject);
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
/*
* Lấy item order
* */
router.get('/:id/getitem', function (req, res, next) {
    var async = res;
    var parameters = {
        UserID: Lazada.api_user,
        Version: Lazada.api_version,
        Action: 'GetOrderItems',
        OrderId: req.params.id,
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
            responseString += d;
            console.info('\nCall completed');
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
                //console.log('so luong : ' + arr.length);
                //async.send(responseObject);
            }else{
                //async.send('Error.');
            }
            async.send(responseObject);
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