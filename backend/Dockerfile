# 使用官方 Node.js 镜像作为基础镜像
FROM node:14

# 创建并设置工作目录
WORKDIR /usr/src/app

# 安装typescript和ts-node
RUN npm install -g typescript ts-node

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将项目文件复制到工作目录
COPY . .

# 编译 TypeScript 代码
#RUN tsc

# 暴露应用运行的端口
EXPOSE 3000
EXPOSE 3001

# 定义启动容器时运行的命令
CMD ["ts-node", "src/server.ts"]
