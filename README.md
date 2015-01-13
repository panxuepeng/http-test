Http-test
====

通过http请求方式对网站进行监控，简单配置后即可使用。

## 配置
在 config.js 设置一下smtp信息。然后在tasks目录下增加测试任务，参考 tasks/default.js 即可。


## 启动

### 一次测试
node main

### 定时测试，并发送邮件

	node main --timeout=600
	node main --timeout=3600 --sendmail --task=default
	timeout 单位是秒
	
## 测试结果
	
	一次测试结束后，会将测试结果发送到 tasks/default.js 文件中指定的收件人列表。
	
	邮件内容：
	{
	　"exception": [],
	　"error": [],
	　"success": [
	　　"首页: 200 GET http://www.baike.com",
		...
	　]
	}
