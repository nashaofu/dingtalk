# dingtalk[![Build Status](https://travis-ci.org/nashaofu/dingtalk.svg?branch=master)](https://travis-ci.org/nashaofu/dingtalk)[![Build status](https://ci.appveyor.com/api/projects/status/jptk80n78gdogd18/branch/master?svg=true)](https://ci.appveyor.com/project/nashaofu/dingtalk/branch/master)
钉钉桌面版，基于electron和钉钉网页版开发，支持Windows、Linux和macOS

## 公司招聘

杭州氦氪科技有限公司(项目作者公司)招聘初级、中级前端工程师，欢迎投递简历
邮箱：diao.cheng@hekr.me
有意向者可直接发送简历到邮箱，或者通过GitHub联系我

工作职责：
1. 负责产品的的前端系统设计、开发，实现页面原型效果；
2. 优化前端框架，封装公共js，实现页面复杂功能实现，解决开发过程中遇到的问题；
3. 编写可复用的用户界面组件；
4. 协助后台开发人员实现页面及交互，完成前后端合并。

职位要求：
1. 2年以上的前端领域开发经验，
2. 精通HTML5、CSS3、 DIV+CSS，能够高效构建WEB前端项目与应用
3. 熟悉前端性能优化，熟练使用各种调试抓包工具，能独立分析、解决和归纳问题
4. 熟悉前端MVVM架构（Vue.js或React.js）2年以上开发经验者优先
5. 熟练使用gulp，webpack，babel等前端工具
6. 熟悉git，有良好的代码习惯
7. 前端性能优化，熟练使用各种调试抓包工具，能独立分析、解决和归纳问题
8. 较好的问题解决能力、沟通能力及学习能力，能反馈并主动Push项目问题的解决

加分项：
1. 了解mvvm框架实现原理
2. 有参与开源项目
3. 有代码洁癖
4. 阅读过开源项目源码

## 安装步骤
> 直接从[GitHub relase](https://github.com/nashaofu/dingtalk/releases/latest)页面下载最新版安装包即可

## 手动构建
```bash
# 安装依赖
npm i

# 打包源码
npm run build

# 生成安装包
npm run release
```
注：最后一个命令运行会报错，如果报错信息为token相关，直接忽略即可，该报错为部署到GitHub release时token不存在的错误，生成的包是完全正常的

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
7. 系统设置界面
![7.png](./screenshot/7.png)
8. 关于界面
![8.png](./screenshot/8.png)

## 功能说明
1. 本版本是基于网页版钉钉和electron制作的
2. 本版本与网页版的区别
    * 解决了网页版钉钉内容区域无法最大化的问题
    * 除了少数的功能未能够完全实现，其余的使用体验和PC版钉钉基本一致
3. 支持屏幕截图，并且支持多显示器截图。截图快捷键为`ctrl+alt+a`
4. 添加应用分类，[Linux系统分类](https://specifications.freedesktop.org/menu-spec/latest/apa.html#main-category-registry)
5. 目前已经支持Linux、macOS和Windows三个平台

## 更新说明
1. 支持屏幕截图，并且支持多显示器截图。截图快捷键为`ctrl+alt+a`，2017-10-23
2. 支持网络错误页面提示，网络恢复自动跳转到登陆页面，2017-12-28
3. 修改网络错误页面，支持快捷键设置，2018-02-07
4. 更新截图功能，支持多显示器截图，目前确认支持Ubuntn16，Ubuntn17不支持，其他Linux系统未测试，其中使用了[shortcut-capture](https://github.com/nashaofu/shortcut-capture)模块来实现截图；修复设置页面不修改快捷键时，点击保存时提示错误的BUG，2018-03-03
5. 整个项目采用webpack打包，采用electron-builder来构建应用，分别构建生成三大平台安装包，2018-03-22
6. 添加关于页面，文件下载进度支持，消息提示不弹出问题修复，修复Linux更新问题，2018-04-01
7. 修复消息提示node-notifier图标显示问题，2018-04-07

## TODO
- [x] 支持网络断开时显示错误页
- [x] 添加关于页面
- [x] 消息提示在windows上不出来的BUG，或者替换为node-notifier模块

## 关于支持加密信息的说明
加密信息暂不支持，详情请看[企业信息加密相关](https://github.com/nashaofu/dingtalk/issues/2)，也欢迎各位朋友能够去研究一下，帮助实现这个功能
