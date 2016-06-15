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
* Lấy danh sách sản phẩm database
* */
router.get('/', function (req, res, next) {
    Models.Product.find({})
        .exec( function (err, products){
        if(err){
            res.send('error has occurred.');
        }else{
            var total = 0;
            products.forEach(function (item, index) {
                total += item.Price;
            });
            res.render('products/list', {
                title: 'Products',
                desc: 'List',
                data: products,
                total: total
            });
        }
    });
    // res.render('products/list', {
    //     title: 'Products',
    //     desc: 'List'
    // });
});
router.post('/', function (req, res, next) {
    console.log(req.body);
    var iTotalRecords = 178;
    var iDisplayLength = parseInt(req.body.length);
    iDisplayLength = iDisplayLength < 0 ? iTotalRecords : iDisplayLength;
    var iDisplayStart = parseInt(req.body.start);
    var sEcho = parseInt(req.body.draw);
    var end = iDisplayStart + iDisplayLength;
    end = end > iTotalRecords ? iTotalRecords : end;

    var records = {};
    var data = [];
    var a= 0;
    for(var i = 0; i < 178; i++) {
        a += i;
        var status = "Pending";
        var id = (i + 1);
        data.push(['<input type="checkbox" name="id[]" value="' + id + '">', id, '12/09/2013', 'Jhon Doe', 'Jhon Doe', '450.60$', i, '<span class="label label-sm label-success">' + status + '</span>', '<a href="javascript:;" class="btn btn-xs default"><i class="fa fa-search"></i> View</a>']);
    }
    records["data"] = data;
    if (req.body.customActionType && req.body.customActionType == "group_action") {
        records["customActionStatus"] = "OK"; // pass custom message(useful for getting status of group actions)
        records["customActionMessage"] = "Group action successfully has been completed. Well done!"; // pass custom message(useful for getting status of group actions)
    }
    records["draw"] = sEcho;
    records["recordsTotal"] = iTotalRecords;
    records["recordsFiltered"] = iTotalRecords;
    res.json(records);

    // res.render('products/list', {
    //     title: 'Products',
    //     desc: 'List'
    // });
});
/*
* Lấy danh sách sản phẩm trên lazada
* */
router.get('/getproducts', function (req, res) {
    var parameters = {
        UserID: Lazada.api_user,
        Version: Lazada.api_version,
        Action: 'GetProducts',
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
        function pareLazada(callback) {
            var reqGet = https.request(optionsget, function (resp) {
                resp.setEncoding('utf-8');
                var responseString = '';
                resp.on('data', function (d) {
                    responseString += d;
                    console.info('Loading\n');
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
                //console.error(e);
            });
        }
        //,
        // function get(data, callback) {
        //     var data = data; // lấy được biến responseObject từ phía trên
        // }
    ], function(err,result) {
        if(err){
            console.error(e);
            return;
        }
        //res.send(result);
        // insert database
        if(result.SuccessResponse) {
            result = result.SuccessResponse.Body.Products.Product;
            result.forEach(function (item, index) {
                var data = new Models.Product();
                data.SellerSku = item.SellerSku;
                data.Name = item.Name;
                data.Quantity = parseFloat(item.Quantity|0);
                data.Available = parseFloat(item.Available|0);
                data.Price = parseFloat(item.Price|0);
                data.SalePrice = parseFloat(item.SalePrice|0);
                data.SaleStartDate = item.SaleStartDate;
                data.SaleEndDate = item.SaleEndDate;
                data.Status = item.Status;
                data.MainImage = item.MainImage;

                var img = [];
                if (item.Images.Image) {
                    var data_img = item.Images.Image;
                    if (typeof data_img === 'string') {
                        var item_img = {
                            Image: data_img.toString()
                        };
                        img.push(item_img);
                    } else if (typeof data_img === 'object') {
                        for (var i = 0; i < data_img.length; i++) {
                            var item_img = {
                                Image: data_img[i]
                            };
                            img.push(item_img);
                        }
                        ;

                    }
                }
                data.Images = img;

                data.Description = item.Description;
                data.Brand = item.Brand;
                data.PrimaryCategory = item.PrimaryCategory;

                data.save(function (error) {
                    console.log("***************************");
                    console.log(index);
                    console.log("***************************");
                    if (error) {
                        console.error(error);
                    }
                });
            });
            res.send('complete.');
        }else{
            res.send('error.');
        }
    });
});
/*
* Lấy danh sách thương hiệu sản phẩm
* */
router.get('/getbrands', function (req, res, next) {
    var async = res;
    var parameters = {
        UserID: Lazada.api_user,
        Version: Lazada.api_version,
        Action: 'GetBrands',
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
                async.json(responseObject);
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
/*
* Lấy danh sách loại sản phẩm
* */
router.get('/getcategorytree', function (req, res, next) {
    var async = res;
    var parameters = {
        UserID: Lazada.api_user,
        Version: Lazada.api_version,
        Action: 'GetCategoryTree',
        Format: 'JSON',
        Timestamp: new Date().toISOString(),

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
                async.json(responseObject);
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