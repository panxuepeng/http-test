var argv = require('minimist')(process.argv.slice(2))
var shell = require('shelljs')

// 时间间隔，单位：秒，默认0(一次性检查)
var timeout = argv.timeout || 0

// 此时间段之内进行检查并发送email
// >=8 && <=20
var hours = argv.hours || '8,20'
hours = hours.split(',')

check()
if (timeout) {
	setInterval(function() {
		check()
	}, timeout*1000)
}

function check() {
	var d = new Date
	var h = d.getHours()
	
	if ( h < hours[0] || h > hours[1] ) {
		return console.log('休息中...')
	}
	
	var cmd = 'node check ' + process.argv.slice(2).join(' ')
	console.log(cmd)
	shell.exec(cmd)
}
