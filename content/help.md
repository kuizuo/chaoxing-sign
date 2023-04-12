# 某星签到助手

## 功能

::list{icon=ph:check-circle-duotone}
- 普通签到
- 拍照签到
- 手势签到
- 位置签到
- 签到码签到
- 二维码签到（enc 已不在固定, 如果是刷新二维码, 签到必须在10秒完成）
- 多用户凭据储存
::

## 使用说明

### 1. 添加账号

点击添加按钮 添加某星账号（暂时只支持手机号登录）

### 2. 选择操作类型

![1](/img/1.png)

- 点击 <Icon name="material-symbols:medical-information-outline-sharp" ></Icon> 进入账号详情，到对应课程进行签到。
- 点击 <Icon name="material-symbols:swipe-up-outline" ></Icon> 即可一键签到（自动检测所有课程，所有可签到活动进行签到，比较耗时），
- 点击 <Icon name="mdi:qrcode-scan" ></Icon> 进入二维码签到，上传二维码页面(支持在线扫码)，将会自动识别出二维码中的信息，进行签到。
- 点击 <Icon name="material-symbols:notifications-active-outline" ></Icon> 将会开启监听模式，当有新的签到活动时，会自动进行签到。
- 点击 <Icon name="material-symbols:history-rounded" ></Icon> 查看该账号的签到历史记录。
- 点击 <Icon name="material-symbols:settings-outline" ></Icon> 配置该账号的签到设置。配置如下
![2](/img/2.png)


也可在下方的批量操作栏中进行批量操作。更多功能还在开发中...

### 相关链接

- [拾取坐标系统](https://api.map.baidu.com/lbsapi/getpoint/index.html)

--- 

> 隐私声明: 本应用会收集部分用户信息，用于优化应用体验，不会将数据用于任何途径，介意者请勿使用。

## 免责声明

1. 本应用仅供学习交流技术分享(协议复现、逆向分析、接口交互)，不得用于商业用途。

2. 任何人或组织使用项目中代码进行的任何违法行为与本人无关。

3. 如影响到贵公司利益，请[联系我](mailto:kuizuo12@163.com)删除本项目。

  ```js [file.js]{4-6,7} meta-info=val
  export default () => {
    console.log('Code block')
  }
  ```