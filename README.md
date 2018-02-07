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
1. 二维码登录页面
![1.png](./screenshot/1.png)
2. 账号密码登录页面
![2.png](./screenshot/2.png)
3. 登录后页面展示
![3.png](./screenshot/3.png)
4. 邮箱打开效果
![4.png](./screenshot/4.png)
5. 截图效果预览
![5.png](./screenshot/5.png)
6. 网络错误页面
![6.png](./screenshot/6.png)
7. 网络错误页面
![7.png](./screenshot/7.png)

## 功能说明
1. 本版本是基于网页版钉钉和electron制作的
2. 本版本与网页版的区别
    * 解决了网页版钉钉内容区域无法最大化的问题
    * 除了少数的功能未能够完全实现，其余的使用体验和PC版钉钉基本一致
3. 支持屏幕截图，并且支持多显示器截图。截图快捷键为`ctrl+alt+a`
4. 添加应用分类，[Linux系统分类](https://specifications.freedesktop.org/menu-spec/latest/apa.html#main-category-registry)

## 更新说明
1. 支持屏幕截图，并且支持多显示器截图。截图快捷键为`ctrl+alt+a`，2017-10-23
2. 支持网络错误页面提示，网络恢复自动跳转到登陆页面，2017-12-28
3. 修改网络错误页面，支持快捷键设置，2018-02-04

## TODO
- [x] 支持网络断开时显示错误页

## 关于支持加密信息的说明
加密信息暂不支持，详情请看[企业信息加密相关](https://github.com/nashaofu/dingtalk/issues/2)，也欢迎各位朋友能够去研究一下，帮助实现这个功能

## 写在最后
由于最近一段时间被公司压榨（...逃），所以更新比较缓慢，希望大家能够理解
