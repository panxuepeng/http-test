var worker = require('./worker')
var _ = require('underscore')
var deepExtend = require('deep-extend')
var jsonFormat = require('json-format')
var config = require('./config')
var argv = require('minimist')(process.argv.slice(2))

//console.log(argv)

var task = argv.task || 'default'

// 时间间隔，单位：秒，默认0(一次性检查)
var timeout = argv.timeout || 0

check()
if (timeout) {
	setInterval(function() {
		check()
	}, timeout*1000)
}

function check() {
	var tasks = require('./tasks/'+task)
	//console.log(tasks)
	
	if (tasks.login) {
	
		worker.login(tasks, function(err, results) {
			if (err) {
				var sendmail = require('./mail')(config.smtp)
				var options = deepExtend({}, tasks.mailOptions)
				
				var content = jsonFormat(err)
				options.text = content.replace(/\t/g, '　')
		
				options.subject += '（登录失败）'
				
				if (argv.sendmail) {
					sendmail(options)
				} else {
					console.log(err)
				}
			} else {
				start(tasks)
			}
		})
		
	} else {
		start(tasks)
	}
}

function start(tasks) {
	
	worker.init(tasks)
	worker.exec(function(result) {
		var sendmail = require('./mail')(config.smtp)
		var options = deepExtend({}, tasks.mailOptions)
		
		if ( result.exception.length || result.error.length ) {
			options.subject += '（异常）'
		} else {
			options.subject += '（正常）'
		}
		
		var content = jsonFormat(result)
		options.text = content.replace(/\t/g, '　')
		
		if (argv.sendmail) {
			sendmail(options)
		}
		
		console.log(options.subject, options.to)
	})
}
