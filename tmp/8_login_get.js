var request = require('request')

var options = {
	url: 'http://i.mypep.cn/account/login'
	, method: 'GET'
}

request(options, function (err, res, body) {
	if (err) {
		console.log(err)
	} else {
		console.dir(res.headers['set-cookie'])
		console.log(body)
	}
})