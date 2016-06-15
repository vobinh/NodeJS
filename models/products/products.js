var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var produstSchema = new Schema( { //This is where bugSchema is defined.
    SellerSku: String,
    Name: String,
    Quantity: Number,
    Available: Number,
    Price: Number,
    SalePrice: Number,
    SaleStartDate: String,
    SaleEndDate: String,
    Status: String,
    MainImage: String,
    Images: [{
        Image: String
    }],
    Description: String,
    TaxClass: String,
    Brand: String,
    PrimaryCategory: String
});
module.exports.produstSchema = produstSchema; //Export bugSchema so that models.js can access it.