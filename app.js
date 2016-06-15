var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session')
var bodyParser   = require('body-parser');
var flash        = require('connect-flash');
var https        = require('https');
var passwordHash = require('password-hash');

var twig = require('twig');
// database mongoose (MongoDB)


//Instantiate a Models object so you can access the models.js module.
/*
* Test mongoose
var Models = require("./models/models.js");

var Bee = new Models.Bug({
    bugName: "Vo Binh",
    bugColour: "Red",
    Genus: "Bom"
});

Bee.save(function (error) {
    console.log("Your bee has been saved!");
    if (error) { 
        console.error(error);
    }
});

*/

/*MailGun*/
  // var api_key = 'key-e76516af7726709e48c090cca20b2b28';
  // var domain = 'sandbox54bdc93fa0844c69a4c4eb16e9cefecf.mailgun.org';
  // var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
  //
  // var data = {
  //   from: 'VoBinh <wthanhbinh@gmail.com>',
  //   to: 'torin@techknowledge.vn',
  //   subject: 'Hello',
  //   html: '<p>Testing some Mailgun awesomness!<p>'
  // };
  //
  // mailgun.messages().send(data, function (error, body) {
  //   console.log('---------Send Mail---------');
  //   console.log(body);
  //   console.log('---------------------------');
  // });
/*End MailGun*/

var Models = require("./models/models.js");
var hashedPassword = passwordHash.generate('password123');
console.log(hashedPassword);
/* insert user admin */
  // var admin = new Models.User({
  //   Name: 'admin',
  //   Pass: '123456',
  //   Email: 'wthanhbinh@gmail.com',
  //   Role: {
  //     Type :'admin',
  //     Read: true,
  //     Write: true
  //   }
  // });
  // admin.save(function (err) {
  //   console.log("Your data has been saved!");
  //   console.log("***************************");
  //   console.log(admin.id);
  //   console.log("***************************");
  //   if (err) {
  //     console.error(err);
  //   }
  // });
/* End user admin /*

/*Pull object in array (remove)*/

/*Pull object in array (remove)*/
  /* update _id, name,... */
  // Models.Product.update(
  //     {_id: '575e38ac1840a4a0163c7171'},
  //     {$pull: {Images: {_id: '575e38ac1840a4a0163c7177'}}},
  //     {safe :true},
  //     function (err, data) {
  //       console.log(err, data);
  //     }
  // );

  /* findByIdAndUpdate */
  // Models.Product.findByIdAndUpdate(
  //     '575e38ac1840a4a0163c7171',
  //     {$pull: {Images: {_id: '575e38ac1840a4a0163c7176'}}},
  //     {safe :true},
  //     function (err, data) {
  //       console.log(err, data);
  //     }
  // );
/*Push object to array*/
  // var item = {Image: "https://techmaster.vn/fileman/Uploads/toptal-blog-image-1427379551725.jpg"};
  // Models.Product.findByIdAndUpdate('575a93d1c74963f403c5b1ce',{$push : {Images: item}},{safe :true, upsert: true},function (err, model) {
  //   if(err){
  //     console.error(err);
  //   }
  //   console.info(model);
  // });
/* End Push object to array */

// var data = new Models.Product();
// data.SellerSku = '2381810097';
// data.Name = 'Gậy chụp ảnh và điều khiển Bluetooth (Đỏ)';
// data.Quantity = 0;
// data.Available = 0;
// data.Price = 150000.23;
// data.SalePrice = 93000.55;
// data.SaleStartDate = '2016-01-04 00:00:00';
// data.SaleEndDate = '2019-12-31 00:00:00';
// data.Status = 'inactive';
// data.MainImage = 'https://vn-live-01.slatic.net/p/gay-chup-anh-va-dieu-khien-bluetooth-cam-5152-6049171-1-catalog.jpg';
// data.Images = [{Image: 'https://vn-live-01.slatic.net/p/gay-chup-anh-va-dieu-khien-bluetooth-cam-5152-6049171-1-catalog.jpg'}, {Image: 'https://vn-live-01.slatic.net/p/gay-chup-anh-va-dieu-khien-bluetooth-cam-5152-6049171-1-catalog.jpg'}];
// data.Description = 'Đối với các dòng smartphone hiện nay, chức năng chụp ảnh bằng camera trước thường không được rõ nét, góc nhìn lại không đủ rộng để có thể lấy toàn bộ nhiều người. Do vậy, việc sử dụng gậy chụp ảnh selfie monopod là vô cùng thuận tiện.<b> MonoPod Lamino </b>có kèm giá đỡ có khả năng điều chỉnh kích thước để phù hợp với hầu hết các dòng điện thoại hiện nay. <br />Bộ sản phẩm còn kèm thêm remote điều khiển để bạn dễ dàng kích hoạt tính năng chụp ảnh trên điện thoại qua bluetooth.<br /><br /><b>TÍNH NĂNG NỔI BẬT:</b><br /><b>Thiết kế tiện dụng:</b><br />Gậy chụp ảnh cầm tay MonoPod Travel dùng tốt cho điện thoại, rất tốt cho máy quay phim, và tuyệt vời cho máy ảnh bỏ túi sẽ giúp cho bạn dễ dàng có được những bức ảnh \"tự sướng\" selfie thật đẹp bất kỳ lúc nào.<br /><br /><b>Dễ dàng sử dụng</b><br />Thiết bị MonoPod Travel có kích thước gọn nhẹ, dễ dàng cho bạn mang theo bên mình khi đi du lịch, leo núi, cắm trại... để sử dụng. Gậy có thể điều chỉnh chiều dài tùy ý để giúp góc chụp được mở rộng hơn<br />Bên cạnh đó sản phẩm còn giúp bạn có thể chụp ảnh với đông đủ bạn bè một cách dễ dàng.<br />Thân cây được làm bằng inox pha nhôm, có thể thay đổi độ dài từ 22cm - 110cm.<br />Phần giá đỡ có thể mở rộng hoặc thu hẹp để phù hợp với các dòng điện thoại, máy ảnh du lịch khác nhau.<br />Gậy dài 90cm, chất liệu inox. Giá đỡ điện thoại bằng nhựa.<br />Sản phẩm có thể thu gọn lại (từ 20cm-90cm), dễ dàng để bạn cho vào túi xách và mang theo bất cứ nơi đâu.<br /><br /><b>Remote điều khiển</b><br />Thiết bị remote điều khiển từ xa selfie pro dành cho điện thoại iOS , Android là một trợ thủ đắc lực để bạn tự chụp những bức ảnh đẹp cho mình hay có đủ thành viên trong gia đình.<br />Selfie pro dễ dàng kết nối với điện thoại và máy tính bảng thông qua sóng Bluetooth với khoảng cách lên đến 10m. Chỉ với một thao tác đơn giản, bạn đã nhanh chóng ghi lại được những tấm ảnh tuyệt vời dành cho mình.', data.TaxClass = 'default';
// data.Brand = 'OEM';
// data.PrimaryCategory = 'Chân máy ảnh Monopod';
//
// data.save(function (error) {
//   console.log("Your data has been saved!");
//   console.log("***************************");
//   console.log(data.id);
//   console.log("***************************");
//   if (error) {
//     console.error(error);
//   }
// });



var routes = require('./routes/index');
var products = require('./routes/products');
var orders = require('./routes/orders');
var feeds = require('./routes/feeds')

//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

twig.extendFunction("repeat", function(value, times) {
  return new Array(times+1).join(value);
});

// app.set('twig options', {
//     debug: true
// });
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'a4f8071f-c873-4447-8ee2',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

/*Set session all page*/
app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});

app.use('/', routes);
app.use('/products', products);
app.use('/orders', orders);
app.use('/feeds', feeds);

//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
