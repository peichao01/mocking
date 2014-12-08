#!/usr/local/bin/node

"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var api = require('./lib/api');
var fs = require('fs-extra')
var _path = require('path')
var app = express();


fs.readJson(_path.join(process.cwd(), 'package.json'), function(err, config){
	var port = config.mocking.port;

	// 把请求的路打印出来
	app.use(function(req, res, next){
		console.log('[REQUEST URL] ['+req.method+']: ' + req.originalUrl);
		next();
	});

	app.use(cookieParser())

	// 解析POST的数据
	app.use(bodyParser.json());     // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({ // to support JSON-encoded bodies
		extended: true
	}));

	// API
	app.use('/api', api(config));
	app.use('/api_baidu', api(config));

	app.listen(port);
	console.log('server is running on port: ' + port);

})

