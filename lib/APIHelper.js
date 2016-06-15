var querystring = require('querystring');
var crypto      = require('crypto');
var Lazada      = require("../config/lazada.js");

var APIHelper = {
	ksort : function (obj) {
		var data = {};
	  	Object.keys(obj).sort().forEach(function (key) {
	    	data[key] = obj[key];
	  	});
	  	return data;
	},
	queryString : function(parameters){
		var data = this.ksort(parameters);
		var encoded = [];
		for (var key in data) {
			var strjoin = encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
			encoded.push(strjoin);
		}

		var concatenated = encoded.join('&');
		var hash = crypto.createHmac('sha256', Lazada.api_key).update(concatenated).digest('hex');

		data['Signature'] = encodeURIComponent(hash);
		return querystring.stringify(data);
	}
}
module.exports = APIHelper;