var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var orderSchema = new Schema( { //This is where bugSchema is defined.
    OrderId: String,
    Name: String,
    CustomerFirstName: String,
    CustomerLastName: String,
    OrderNumber: String,
    PaymentMethod: String,
    Remarks: String,
    DeliveryInfo: String,
    Price: Number,
    GiftMessage: String,
    VoucherCode: String,
    CreatedAt: String,
    UpdatedAt: String,
    ItemsCount: Number,
    Statuses: [{
        Status: String
    }]
});
module.exports.orderSchema = orderSchema; //Export bugSchema so that models.js can access it.
