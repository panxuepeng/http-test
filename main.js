var worker = require('./worker')
var _ = require('underscore')
var minimist = require('minimist')
var jsonFormat = require('json-format')
var config = require('./config')
var argv = require('minimist')(process.argv.slice(2))

console.log(argv)

// 时间间隔，单位：秒，默认0(一次性检查)
var timeout = argv.timeout || 0
var task = argv.task || 'default'

check()
if (timeout) {
	setInterval(function() {
		check()
	}, timeout*1000)
}

function check() {
	var d = new Date
	var h = d.getHours()
	var hours = config.hours
	
	if ( h < hours[0] || h > hours[1] ) {
		return console.log('休息中...')
	}
	
	var tasks = require('./tasks/'+task)
	//console.log(tasks)
	
	if (tasks.login) {
	
		worker.login(tasks, function() {
			start(tasks)
		})
		
	} else {
		start(tasks)
	}
}

function start(tasks) {
	var sendmail = require('./mail')(config.smtp, tasks.mailOptions)
	worker.init(tasks)
	worker.exec(function(result) {
		var subject = tasks.mailOptions.subject
		if ( result.exception.length || result.error.length ) {
			subject += '（异常）'
		} else {
			subject += '（正常）'
		}
		
		var content = jsonFormat(result)
		content = content.replace(/\t/g, '　')
		
		if (argv.sendmail) {
			sendmail(subject, content)
		}
		
		console.log(subject)
	})
}