var request = require('request')
var async = require('async')
var _ = require('underscore')



var defaults = {
	url: 'http://www.baike.com'
	, method: 'GET'
	, title: 'url描述'
	, headers: {} // {Referer: '', Cookie: ''}
	, form: {}    // {key: 'value'}
	, statusCode: 200
	, include: ''
}

var tasks = []
var result = {
	exception: []
	, error: []
	, success: []
}

/*
function complete(cb, task) {
	return function (err, res, body) {
		//console.dir(['res.headers', task.title, task.url, res.headers['set-cookie']])
		
		if (err) {
		
			result.exception.push([task.title+': '+task.method+' '+task.url, err])
			cb(null, [task.url, err])
			
		} else if (res.statusCode == 200) {
		
			var info = task.title+': '+ 200 +' '+ task.method+' '+task.url
			
			if (task.include) {
				if ( body.indexOf(task.include) > -1 ) {
					result.success.push(info+' 包含字符串“'+task.include+'”')
				} else {
					result.error.push(info+' 未包含字符串“'+task.include+'”')
				}
			} else {
				result.success.push(info)
			}
			
			cb(null, [200, task.url])
			
		} else {
		
			result.error.push(task.title+': '+res.statusCode +' '+ task.method+' '+task.url)
			cb(null, [res.statusCode, task.url])
			
		}
	}
}
*/

function addTast(option) {
	if (_.isString(option)) {
		option = {
			url: option
		}
	}
	
	var task = _.extend({}, defaults, option)
	
	tasks.push(function(cb) {
	//	console.log('\n\n addTast', task)
		var startTime = + new Date
		
		request(task, function (err, res, body) {
			//console.dir(['res.headers', task.title, task.url, res.headers['set-cookie']])
			var endTime = + new Date
			var t = (endTime - startTime)/1000
			t = t.toFixed(3)
			if (t > 1) {
				t = '【' + t +'s】'
			} else {
				t += 's'
			}
			
			if (err) {
				result.exception.push([task.title+': '+task.method+','+ task.randomCookie+' '+task.url, err])
				cb(null, [t, task.method, task.randomCookie, task.url, err])
				
			} else if (res.statusCode == 200) {
				
				
				var info = task.title+': '+ t +' '+ task.method+','+ task.randomCookie+' '+task.url
				
				if (task.include) {
					if ( body.indexOf(task.include) > -1 ) {
						result.success.push(info+' 包含字符串“'+task.include+'”')
					} else {
						result.error.push(info+' 未包含字符串“'+task.include+'”')
					}
				} else {
					result.success.push(info)
				}
				
				cb(null, [200, t, task.method, task.randomCookie, task.url])
				
			} else {
			
				result.error.push(task.title+': '+res.statusCode +' '+ task.method+','+ task.randomCookie+' '+task.url)
				cb(null, [res.statusCode, t, task.method, task.randomCookie, task.url])
				
			}
		})
	})
	
	return tasks
}


module.exports = {
	add: addTast,
	
	login: function(tasks, callback) {
		async.series([
			function(cb) {
				var startTime = + new Date
				request(tasks.login.get, function(err, res, body) {
					var endTime = + new Date
					if (err) {
						cb(err)
					} else {
						tasks.login.get_callback(res, body)
						cb(null, endTime - startTime)
					}
					
				})
			},
			function(cb) {
				var startTime = + new Date
				request(tasks.login.post, function(err, res, body) {
					var endTime = + new Date
					if (err) {
						cb(err)
					} else {
						tasks.login.post_callback(res, body)
						cb(null, endTime - startTime)
					}
				})
			}
		],
		// optional callback
		function(err, results) {
			if ( err ) {
				console.log('登录失败')
			} else {
				console.log('tasks.cookie', tasks.cookie)
				
			}
			callback(err, results)
		})

		
	},
	init: function(data) {
		tasks = []
		
		var cookie = data.cookie.join('; ')
		var _tasks = data.tasks
		var rc = data.randomCookie
		
		for(var title in _tasks) {
			var o = _tasks[title]
			o.title = title
			o.randomCookie = ''
			
			if (o.headers && o.headers.cookie === true) {
				o.headers.cookie = cookie
				if (_.isArray(rc) && rc.length) {
					o.randomCookie = rc[_.random(rc.length-1)]
					o.headers.cookie += '; '+o.randomCookie
				}
				
			}
			addTast(o)
		}
	},
	tasks: function() {
		return tasks
	},
	result: function() {
		return result
	},
	exec: function(cb) {
		result = {
			exception: []
			, error: []
			, success: []
		}
		
		async.parallelLimit(tasks, 10, function(err, output) {
			console.log(output)
			
			cb(result)
		})
	}
}