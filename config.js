module.exports = {
	// 此时间段之内进行检查并发送email
	// >=8 && <=20
	hours: [8, 20]
	
	, smtp: {
		host: "smtp.*.com",
		port: "25",
		auth: {
			user: "email",
			pass: "password"
		}
	}
}