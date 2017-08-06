# dingtalk[![Build Status](https://travis-ci.org/nashaofu/dingtalk.svg?branch=master)](https://travis-ci.org/nashaofu/dingtalk)
基于网页版钉钉的linux版封装，解决linux上打开网页被关闭后要重新登陆的问题!

## 安装步骤
> 直接从[GitHub relase](https://github.com/nashaofu/dingtalk/releases/latest)页面下载最新版安装包即可

## 手动构建步骤
1. 安装node与npm，版本必须大于4.0.0,npm版本必须高于3.0.0
2. 运行`npm install`安装项目依赖
3. 运行`npm run build`开始打包应用
4. 打包完成之后即可拷贝出dist目录下的文件到想要的文件夹下，运行里面的dingtalk文件即可安装应用。

## 截图效果
1. 二维码登录页面![1.png](./screenshot/1.png)
2. 账号密码登录页面![2.png](./screenshot/2.png)
3. 登录后页面展示![3.png](./screenshot/3.png)

## 功能说明
1. 本版本是基于网页版钉钉和electron制作的
2. 本版本与网页版的区别
    * 解决了网页版钉钉内容区域无法最大化的问题
    * 除了少数的功能未能够完全实现，其余的使用体验和PC版钉钉基本一致

## 更新说明
1. 图标系列制作与通知栏图标修改
2. 弹出消息提示在Linux上优化
3. 通知栏图标支持单击弹出窗口

## TODO
1. 支持网络断开时显示错误页
