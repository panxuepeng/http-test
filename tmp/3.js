var request = require('request')

var options = {
	url: 'http://i.mypep.cn/account/login'
//	, method: 'GET'
	, method: 'POST'
	, headers: {
//		Referer: 'http://book.mypep.cn/read/62'
		cookie: 'mypep_session=eyJpdiI6IlRONTk0UXIxMm13RzlCaVJpSWxQUEE9PSIsInZhbHVlIjoiaENQXC9iQkhqZkp0SkNSeHBPQmMwQXpESzFncnhLTXc3dTRXaVlZXC93TWRBTDZqTFRHTU0wdVRGMXlvQ1wvQ0hkUVE0VjVpNjJPNFRWcE01eDNPSG4zalE9PSIsIm1hYyI6IjVkNzllMDRkOGE0ZWY4YWM3NmRkYmM3MGQ2YTdhZjQyOWE3ZTUwNTdmMzE3MmI4ZjJhYWU3ZGVjMmNjNzBjMjUifQ%3D%3D;'
	}
	, form: {
		_token: 'UCZ8PwEdSKqKeYGKkfdhP9Gr9AoDVqPxxJ5TD1nE'
		, username: 'test4student'
		, password: '111111'
		, next: 'http://www.mypep.cn/'
		, remember_me: '0'
	}
}

request(options, function (err, res, body) {
	if (err) {
		console.log(err)
	} else {
		console.dir(['res.headers', res.headers['set-cookie']])
		console.log(body)
	}
})