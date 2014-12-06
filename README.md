mocking
=====

mock the api server, make the development of frontend & native(IOS/androind) disengaged from the server side development dependence. api server may be not stable in the developement period and the api can not be requested.

数据接口模拟，使【web前端/客户端】开发完全摆脱对【服务端】的依赖。避免因为接口不稳定对前端开发的影响。


mocking has `local` and `remote` mode, means the api can be responsed by the local javascript file or the online server, just switch each route controll in the config file(mocking.json) individually.    

mocking有两种模式：`local` 和 `remote`，意味着访问 api 时可以使用本地javascript文件或者线上服务器来响应请求，只需要在配置文件(mocking.json)中单独的针对每一个路由来切换即可。


download and run it, you will know all details. so easy!  

下载并运行一下，你就知道所有的一切了，so easy!

Install
----------
```shell
$ npm install mocking --save-dev
```

Config
----------
edit `mocking.json` or add and edit `mocking.custom.json`. see the example `mocking.json` file for more infomation.

Running
-------------
```shell
$ npm start
```

Usage
-----

set `port` at package.json->mocking->port


mocking.json

```javascript
{
    // use the custom config overwrite the defaults, and add the file in the `.gitignore` file, this is useful in the team.
    // 可以使用自定义配置覆盖默认配置，并把这个文件添加到 `.gitignore` 中，在团队协作时使用
    "customConfigFile":"./mocking.custom.json",
    // the online server host, this will be used in the remote mode.
    // 线上服务器的地址，在使用 `remote` 模式时会用到
    "api_remote_origin":"http://test.baidu.com",
    "api":[
        // 每一个单独的路由; single route
        {
            // this route will be ignored if `type === 'comment'`
            "type":"xx",
            // *important* 
            "rule":"/api/local/{order_id}",
            // if use the local file to response，是否使用本地模式
            "useLocal":true,
            // 如果使用remote模式，则，需要访问的线上地址，如果不是以 http 开头，则需要配置 `api_remote_origin`
            "remoteUrl":"/api/remote",
            // 如果使用local模式，则，需要使用的本地文件
            "localPath":"./data/test_local.js",
            // all other properties are as comments.其他一切字段都是用来备注的
            "":""
        },
        {
         // ...
        }
    ]
}
```

data/test_local.js

```javascript
// request path: /api/local/3
module.exports = function(req, res){
  var method = req.method
  var id = req.params.order_id
  var response
  if(method == 'GET'){
    response = {
      id: id
    }
  }
  else{
    response = {
    }
  }
  return JSON.stringify(response)
}
```
