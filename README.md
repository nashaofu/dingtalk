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
4. 邮箱打开效果![4.png](./screenshot/4.png)

## 功能说明
1. 本版本是基于网页版钉钉和electron制作的
2. 本版本与网页版的区别
    * 解决了网页版钉钉内容区域无法最大化的问题
    * 除了少数的功能未能够完全实现，其余的使用体验和PC版钉钉基本一致

## 更新说明
1. 支持邮箱打开

## TODO
1. 支持网络断开时显示错误页


## 左边导航HTML
```html
<ul class="main-menus">
                <li class="menu-item menu-message selected" ng-click="home.goState('authorized.im')" ng-class="{selected:home.$state.includes('authorized.im')}" ng-dblclick="home.scrollToUnReadConv()">
                    <div class="menu-item-content">
                        <i class="iconfont menu-icon tipper-attached" htitle="消息" htitle-direction="right"></i>
                        <!-- ngIf: home.$my.uid --><all-conv-unread-count ng-if="home.$my.uid" class="ng-scope ng-isolate-scope"><!-- ngIf: $ctrl.unreadMsgCount > 0 --></all-conv-unread-count><!-- end ngIf: home.$my.uid -->
                    </div>
                </li>
                <li class="menu-item menu-ding" ng-click="home.goState('authorized.ding')" ng-class="{selected:home.$state.includes('authorized.ding')}">
                    <div class="menu-item-content">
                        <i class="iconfont menu-icon tipper-attached" htitle="DING" htitle-direction="right"></i>

                        <!-- ngIf: home.newDingList.newCount + home.newCommentList.unreadCount !== 0 -->
                    </div>
                </li>
                <li class="menu-item menu-company-call-center" ng-click="home.onTelClick()" ng-class="{selected:home.$state.includes('authorized.companyCallCenter')}">
                    <div class="menu-item-content">
                    <i class="iconfont menu-icon tipper-attached" htitle="电话" htitle-direction="right"></i>
                        <!-- ngIf: home.$my.uid --><unread-call ng-if="home.$my.uid" class="ng-scope ng-isolate-scope"><!-- ngIf: $ctrl.unreadPointNum > 0 --><span class="unread-num ng-scope" ng-if="$ctrl.unreadPointNum > 0"><em class="ng-binding">1</em></span><!-- end ngIf: $ctrl.unreadPointNum > 0 -->
</unread-call><!-- end ngIf: home.$my.uid -->
                    </div>
                </li>
                <li class="menu-item menu-contact" ng-click="home.onContactClick()" ng-class="{selected:home.$state.includes('authorized.contact')}">
                    <div class="menu-item-content">
                        <i class="iconfont menu-icon tipper-attached" htitle="联系人" htitle-direction="right"></i>
                    </div>
                </li>
                <!-- ngIf: home.isShowMicroApp && !home.ua.isDesktop || home.isShowMicroApp && home.ua.isDesktop && !home.isShowWorkIndependent --><li class="menu-item menu-micro-app ng-scope" ng-if="home.isShowMicroApp &amp;&amp; !home.ua.isDesktop || home.isShowMicroApp &amp;&amp; home.ua.isDesktop &amp;&amp; !home.isShowWorkIndependent" ng-click="home.onMicroAppClick()" ng-class="{selected:home.$state.includes('authorized.microApp')}">
                    <div class="menu-item-content">
                        <i class="iconfont menu-icon tipper-attached" htitle="工作" htitle-direction="right"></i>
                    </div>
                </li><!-- end ngIf: home.isShowMicroApp && !home.ua.isDesktop || home.isShowMicroApp && home.ua.isDesktop && !home.isShowWorkIndependent -->
                <!-- ngIf: home.ua.isDesktop && home.isShowMicroApp && home.isShowWorkIndependent -->
                <li class="menu-item menu-cspace" ng-click="home.goState('authorized.cspace')" ng-class="{selected:home.$state.includes('authorized.cspace')}" log="tab_space_click">
                    <div class="menu-item-content">
                        <i class="iconfont menu-icon tipper-attached" htitle="钉盘" htitle-direction="right"></i>
                        <!-- ngIf: home.$my.uid --><unread-cspace ng-if="home.$my.uid" class="ng-scope ng-isolate-scope"><!-- ngIf: $ctrl.unreadPointNum > 0 --><i ng-if="$ctrl.unreadPointNum > 0" class="iconfont unread-dot cspace-unread-dot ng-scope"></i><!-- end ngIf: $ctrl.unreadPointNum > 0 --></unread-cspace><!-- end ngIf: home.$my.uid -->
                    </div>
                </li>
            </ul>
```
