MongoDB Server
===

创建.env文件
```text
TOKEN_SECRET=your-secret-key
PORT=8080
WS=8081
DATABASE_URL=mongodb://username:password@ip:27017/databaseName?authSource=admin

# 阿里云 OSS
OSS_REGION=
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET_NAME=
```

测试运行
```shell
nodemon --watch src --exec ts-node src/server.ts 
```

打包
```shell
tsc 
```

上传到服务器
```shell
scp -r dist aliyun:/root/mongo-server/ 
```

上传项目到服务器
```shell
scp -r . aliyun:/root/mongo-server/
```

ApiFox 文档地址
```shell
nodemon --watch src --exec ts-node src/server.ts 
```

中间件链的工作原理

	1.中间件顺序执行：
	    当请求到达 Koa 应用时，它会从第一个中间件开始执行，每个中间件执行完后，会调用 await next();，然后 Koa 将调用下一个中间件。
	    一旦所有中间件都执行完，响应会返回到最初的中间件中，继续执行。
	2.错误处理：
	    如果一个中间件中出现错误，你可以使用 try-catch 语句来捕获这些错误，并处理它们。
