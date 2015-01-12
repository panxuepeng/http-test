var request = require('request')
var async = require('async')

async.parallel(
	[
		function(callback){
			request('http://www.mypep.cn', function (err, response, body) {
				if (err) {
					callback(err)
				} else if (response.statusCode == 200) {
					callback(null, 200)
				}
			})
		},
		function(callback){
			request('http://book.mypep.cn', function (err, response, body) {
				if (err) {
					callback(err)
				} else if (response.statusCode == 200) {
					callback(null, 200)
				}
			})
		}
	],
	function(err, results){
		console.log(results)
	}
)