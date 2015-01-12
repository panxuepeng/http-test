var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var transporter
var smtp

// send mail with defined transport object

var send = function(mailOptions) {
	transporter = nodemailer.createTransport(smtpTransport(smtp))
	
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error)
		} else {
			console.log('Message sent: ' + info.response)
		}
	})
}

module.exports = function(_smtp) {
	smtp = _smtp	
	
	return send
}