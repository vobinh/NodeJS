var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema( { //This is where bugSchema is defined.
    Name: {type :String, unique: true},
    Pass: String,
    Email: {type :String, unique: true},
    Role: {
        Type: {type: String, default: 'user'},
        Read: {type: Boolean, default: true},
        Write: {type: Boolean, default: false}
    },
    Description: String,
    TaxClass: String,
    Brand: String,
    PrimaryCategory: String
});
module.exports.userSchema = userSchema; //Export bugSchema so that models.js can access it.