## 使用指南
### 安装
    npm install lk-log --save-dev
### 使用
    import lkLog from "lk-log";
    const logger = lkLog.getLogger("file name");
    lkLog.config({
        //host: "",
        //logUrl: "project log url",
        //logLevel: 1 //close:0, primary:1, major:2, normal:3, minor:4
    });

    logger.primary("log content"); //关键级别
    logger.major("log content"); //主要级别
    logger.normal("log content"); //正常级别
    logger.minor("log content"); //低级别
## 开发指南
### 安装依赖包
    npm install
### 开发
    npm run dev
### 打包
    npm run build
### 测试
    npm run test
### 持续测试
    npm run test:watch

## 文档生成说明
使用typedoc的webpack插件生成文档在在dist目录的docs下

## 版本说明
### 1.0.1
1. 更新lk-http-request组件
1. 更正readme
1. 增加host等配置功能

### 1.0.2
1. 增加es5入口，for webpack

### 1.0.3
1. 更新lk-http-request至1.0.3
1. 补充说明文档
1. 增加request log catch error

### 1.0.4
1. 打logger方法返回为promise
1. 输出logs->log，从数组改为object
1. 增加全局配置参数id，代表该客户端的id

### 1.0.5
1. loglevel从sessionstorage获取