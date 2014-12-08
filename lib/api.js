"use strict";

var fs = require('fs-extra');
var async = require('async');
var _path = require('path');
var _ = require('underscore');
var http = require('http');
var url = require('url');

_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g
};


var configFilePath = _path.join(process.cwd(), 'mocking.json');

function api_server(packageConfig){
	return function(req, res, next){
		async.waterfall([
			function(cb){fs.readJson(configFilePath, cb)},
			function(config, cb){
				if(!config || !config.api) throw '[ERROR] ensure config file('+configFilePath+') is exists and the "api" attribute is setted.';

				if(config.customConfigFile) {
					var customConfigFile = _path.join(_path.dirname(configFilePath), config.customConfigFile)
					fs.exists(customConfigFile, function(exist){
						if(exist){
							fs.readFile(customConfigFile, {encoding:'utf-8'}, function(err, content){
								var customConfig
								try{
									customConfig = JSON.parse(content)
								}
								catch(e){
									throw '[ERROR] custom config file "'+customConfigFile+'" is not a valid JSON.'
								}

								extend(config, customConfig, ['api'])
								extend(replaceFilePath(config.api, configFilePath), replaceFilePath(customConfig.api, customConfigFile))

								cb(null, config)
							})
						}
						else{
							throw '[ERROR] custom config file "'+customConfigFile+'" not exist.'
						}
					})

				}
				else{
					cb(null, config)
				}
			},
			function(config, cb){
				var requestPathname = normalizePath(_path.join(req.baseUrl, req.path));
				var reg = /\{\s*(.+?)\s*\}/g
				var api = _.find(config.api, function(api){
					// 注释
					if(api.type == 'comment') return
					var rule = api.rule;

					var m = rule.match(reg)
					if(m){
						var ruleReg = new RegExp('^' + rule.replace(reg, '([^\/]+)') + '$')
						var pathMatch = requestPathname.match(ruleReg)
						if(pathMatch){
							m.forEach(function(m, i){
								// 去掉两边的大括号
								var name = m.substring(1,m.length-1).trim()
								var value = pathMatch[i + 1]
								req.params[name] = value
							})
							return true
						}
					}
					else{
						return requestPathname === rule
					}
				});
				if(!api) throw '[ERROR] no api set to request.path: "'+requestPathname+'".';

				cb(null, api, config)
			}
		], function(err, api, config){
			if(!err){
				var responseHeaders = {}
				_.each(packageConfig.mocking && packageConfig.mocking.res && packageConfig.mocking.res.headers, function(val, key){
					if(typeof val == 'string'){
						val = _.template(val)({
							req: req,
							res: res
						})
					}

					responseHeaders[key] = val
				})

				// 本地
				if(api.useLocal){
					if(req.method == 'OPTIONS'){
						res.set(responseHeaders).status(200).send()
					}
					else{
						var localDataPath = api.localPath;

						async.waterfall([
							function(cb){
								fs.exists(localDataPath, function(exist){
									if(exist) cb(null)
									else throw '[ERROR] api data file not exist at "'+localDataPath+'".';
								});
							}
						], function(err){
							delete require.cache[require.resolve(localDataPath)];
							var m = require(localDataPath);
							var response = m(req, res);
							res
								.set(responseHeaders)
								.set({
									'Content-Type': req.param('callback') ? 'text/javascript;charset=utf-8' : 'application/json',
									'Content-Length':response.length
								})
								.status(200)
								.send(response);
						});
					}
				}
				// 远程
				else{
					var isStartWithHttp = api.remoteUrl.indexOf('http://') == 0
					if(!isStartWithHttp && !config.api_remote_origin)
						throw '[ERROR] u should set "api_remote_origin" field if use remote mode or set a url begin with "http://".';

					var remoteUrl = isStartWithHttp ? api.remoteUrl : (config.api_remote_origin + api.remoteUrl)
					var remoteUrlParsed = url.parse(remoteUrl)
					http.request({
						method: req.method,
						host: remoteUrlParsed.host,
						hostname: remoteUrlParsed.hostname,
						port: remoteUrlParsed.port,
						path: remoteUrlParsed.path,
						headers: req.headers
					}, function(serverFeedback){
						if(serverFeedback.statusCode == 200){
							res
								.status(serverFeedback.statusCode)
								.set(serverFeedback.headers)
								.set(responseHeaders)
							serverFeedback
								.on('data', function(chunk){
									res.write(chunk)
								})
								.on('end', function(){
									res.end();
								});
						}
						else{
							res.send(500, '[ERROR] some error when request remote api.')
						}
					}).end();
				}
			}
			else{
				throw (err || '[ERROR] something wrong.');
			}
		});
	}
}

function extend(destination, source, excepts){
	excepts = excepts || []
	_.each(source, function(val, key){
		if(excepts.indexOf(key) < 0){
			destination[key] = val
		}
	})
	return destination
}

function replaceFilePath(apiArray, configFilePath){
	apiArray && apiArray.forEach(function(api){
		if(api.localPath) api.localPath = _path.join(_path.dirname(configFilePath), api.localPath)
	})
	return apiArray
}

function normalizePath(path){
	return _path.sep == '/' ? path : path.split(_path.sep).join('/')
}

module.exports = api_server;