var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var transporter
var mailOptions

// send mail with defined transport object

var send = function(subject, content) {
	mailOptions.subject = subject
	mailOptions.text = content
	
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error)
		} else {
			console.log('Message sent: ' + info.response)
		}
	})
}

module.exports = function(smtp, options) {
	mailOptions = options
	transporter = nodemailer.createTransport(smtpTransport(smtp))
	
	return send
}