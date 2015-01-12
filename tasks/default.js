module.exports = {

	mailOptions: {
		from: 'apphudong@163.com',
		to: 'panxuepeng@*.com',
		subject: '报警邮件标题',
		text: 'content word',
	//    html: '<b>Hello world</b>'
	}
	
	// 随机cookie，从这些当中随机取一个合并到cookie上
	, randomCookie: []
	
	// 注意前后不要保留空格或分号
	, cookie: [
		// 'key=value'
	]
	
	/*
	// 测试开始之前登录到系统，并记录登录cookie
	, login: {
		get: {
			url: 'http://i.mypep.cn/account/login'
			, method: 'GET'
		},
		get_callback: function(res, body) {
			var cookies = res.headers['set-cookie']
			var self = this
			
			// ['key=value; path=/']
			cookies = cookies.map(function(item) {
				return item.split('; ')[0]
			})
			
			// console.log(cookies)
			self.post.headers.cookie = cookies.join('; ')
			
			var re_token = /<input name="_token" type="hidden" value="(\w+)">/i
			var _token = body.match(re_token)
			//var _token = re_token.exec(body)
			if (_token) {
				console.log('token', _token[1])
				
				self.post.form._token = _token[1]
			} else {
				console.log('token', '获取失败')
			}
			
		},
		
		post: {
			url: 'http://i.mypep.cn/account/login'
			, method: 'POST'
			, headers: {
				cookie: true
			}
			, form: {
				_token: ''
				, username: '***'
				, password: '***'
				, next: 'http://www.mypep.cn/'
				, remember_me: '0'
			}
		},
		post_callback: function(res, body) {
			var cookies = res.headers['set-cookie']
			//console.log(this, body)
			
			cookies.forEach(function(item) {
				var _cookie = item.split('; ')[0]
				
				// 保存登录 cookie sso_access_token
				if ( _cookie.substr(0, 16) === 'sso_access_token' ) {
					console.log('登录成功')
					exports.cookie.push(_cookie)
				}
			})
		},
	}
	*/
	, tasks: {
		'百科首页': {
			url: 'http://www.baike.com'
		}
	}
}