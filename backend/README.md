Server
===

创建.env文件
```text
TOKEN_SECRET=your-secret-key
PORT=3000
DATABASE_URL=mongodb://username:password@ip:27017/databaseName?authSource=admin
```

测试运行
```shell
nodemon --watch src --exec ts-node src/server.ts 
```
