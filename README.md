mocking
=====

mock the api server, make the development of frontend & native(IOS/androind) disengaged from the server side development dependence. api server may be not stable in the developement period and the api can not be requested.

数据接口模拟，使【web前端/客户端】开发完全摆脱对【服务端】的依赖。避免因为接口不稳定对前端开发的影响。


mocking has `local` and `remote` mode, means the api can be responsed by the local javascript file or the online server, just switch each route controll in the config file(mocking.json) individually.    

mocking有两种模式：`local` 和 `remote`，意味着访问 api 时可以使用本地javascript文件或者线上服务器来响应请求，只需要在配置文件(mocking.json)中单独的针对每一个路由来切换即可。


download and run it, you will know all details. so easy!  

下载并运行一下，你就知道所有的一切了，so easy!

install
----------
```javascript
npm install mocking --save-dev
```

config
----------
edit `mocking.json` or add and edit `mocking.custom.json`. see the example `mocking.json` file for more infomation.

running
-------------
```javascript
npm start
```

