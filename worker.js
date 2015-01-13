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
	exception: [],
	error: [],
	success: []
}


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

function addTast(option) {
	if (_.isString(option)) {
		option = {
			url: option
		}
	}
	
	var task = _.extend({}, defaults, option)
	
	tasks.push(function(cb) {
	//	console.log('\n\n addTast', task)
		request(task, complete(cb, task))
	})
	
	return tasks
}


module.exports = {
	add: addTast,
	
	login: function(tasks, callback) {
		async.series([
			function(cb) {
				request(tasks.login.get, function(err, res, body) {
					if (err) {
						cb(err)
					} else {
						tasks.login.get_callback(res, body)
						cb(null, 'ok')
					}
					
				})
			},
			function(cb) {
				request(tasks.login.post, function(err, res, body) {
					if (err) {
						cb(err)
					} else {
						tasks.login.post_callback(res, body)
						cb(null, 'ok')
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
			callback(err)
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
			
			if (o.headers && o.headers.cookie === true) {
				o.headers.cookie = cookie
				if (_.isArray(rc) && rc.length) {
					o.headers.cookie += '; '+rc[_.random(rc.length-1)]
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
	reset: function() {
		result = {
			exception: [],
			error: [],
			success: []
		}
	},
	exec: function(cb) {
		this.reset()
		
		async.parallelLimit(tasks, 10, function(err, output) {
			console.log(output)
			
			cb(result)
		})
	}
}