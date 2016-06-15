var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');
var APIHelper = require("../lib/APIHelper.js");
var Lazada = require("../config/lazada.js");
var auth = require("../lib/auth.js");
var Models = require("../models/models");
//router.all('/*', auth.authenticate('admin'));
/* GET home page. */
router.get('/getpordusts', function (req, res, next) {
    var my = res;
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
            my.send(responseObject);
        });
    });

    reqGet.end();
    reqGet.on('error', function (e) {
        console.error(e);
    });
});

router.get('/', auth.authenticate('admin'), function (req, res, next) {
    res.render('index.twig',
        {
            title: "Dashboard",
            desc: "Report"
        }
    );
});

router.get('/login', function (req, res, next) {
    res.render('login', {mgs: req.flash()});
});

router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/login');
});

router.post('/login', function (req, res, next) {
    var name = req.body.username;
    var pass = req.body.password;
    Models.User.findOne({Name: name, Pass: pass}, function (err, user) {
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        if(!user){
            req.flash('info', 'Tài Khoản Hoặc Mật Khẩu Không Đúng.');
            return res.redirect('/login');
        }

        req.session.user = user;
        return res.redirect('/');
    });
});

module.exports = router;
