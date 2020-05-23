## https代理服务器

80行代码实现一个带简单用户验证的https代理服务器，科学上网如此简单！

### 基本思路
https过GFW，代理服务器建立TCP连接盲转发请求

### 前期准备工作

- 一台jingwai服务器，推荐搬瓦工CN2网络，不多说
- 一个域名，https://cn.aliyun.com/

### 开始
1. 拷贝index.js至vps
2. 获取证书，详情：https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E

3. 填入预设密码，修改以下内容
```js
//14行和43行
if (!(pwd && pwd === 'Basic <root:pwd>'))
```
`<root:pwd>`需换成 `'用户名:密码'` 的base64

如果用户名是root，密码是pwd，则要填入的字符串就是`"cm9vdDpwd2Q="`

ps: 浏览器控制台，`btoa()`把字符串转换为base64


4. 填入证书的路径
```js
//74和75行
key: fs.readFileSync('/root/.acme.sh/域名/域名.key'),  //私钥
cert: fs.readFileSync('/root/.acme.sh/域名/域名.ltd.cer'), //证书
```
修改路径为你所申请的证书所在的路径
