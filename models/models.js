var mongoose = require("mongoose");
/* Imports the Bugs module. It contains the bug schema we need. */
var Bugs = require("./bugs/bugs.js");
var Products = require("./products/products");
var Users = require("./users/users");
var Orders = require("./orders/orders");

mongoose.connect("mongodb://localhost:27017/CSM");

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
    console.log("Connection succeeded.");
});

//This creates the Bug model.
var Bug = mongoose.model("Bug", Bugs.bugSchema);
/* Export the Bug model so index.js can access it. */
module.exports.Bug = Bug;

//This creates the Product model.
var Product = mongoose.model("Product", Products.produstSchema);
/* Export the Product model so index.js can access it. */
module.exports.Product = Product;

//This creates the User model.
var User = mongoose.model("User", Users.userSchema);
/* Export the User model so index.js can access it. */
module.exports.User = User;

//This creates the User model.
var Order = mongoose.model("Order", Orders.orderSchema);
/* Export the User model so index.js can access it. */
module.exports.Order = Order;