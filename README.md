# 石之家楼层显示FFlogs数据
为方便高难招募的便捷查询工具

安装：https://greasyfork.org/zh-CN/scripts/482770

## 本地开发
参考 https://unluckyninja.notion.site/Vite-e1ca6ae9949241a99014b84e8083712c

### 开发用脚本
```js
// ==UserScript==
// @name         石之家dev
// @namespace    https://your.site/
// @version      0.1.0
// @description  What does your script do
// @author       You
// @match        https://ff14risingstones.web.sdo.com/pc/index.html
// @connect      fflogs.com
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @noframes
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.GM = GM;
		// source: https://cn.vitejs.dev/guide/backend-integration.html
		// 注意端口是否正确，以及是否修改了默认入口文件
    GM_addElement('script', {
        src: 'http://localhost:5173/@vite/client',
        type: 'module'
    });
    GM_addElement('script', {
        src: 'http://localhost:5173/src/main.ts',
        type: 'module'
    });
})();
```

### 构建生产版本

```bash
pnpm build 
# or
pnpm build --watch
```
生成的文件位于 `./dist/yourscript.iife.user.js`