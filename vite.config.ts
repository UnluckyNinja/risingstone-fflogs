import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'userscript',
      formats: ['iife'],
      fileName: format => `yourscript.${format}.user.js`,
    },
    rollupOptions: {
      // input: './src/main.ts',
      external: ['GM', 'GM_xmlhttpRequest','GM_addStyle'],
      output: {
        globals: {
          GM: 'GM',
          GM_xmlhttpRequest: 'GM_xmlhttpRequest',
          GM_addStyle: 'GM_addStyle',
        },
        inlineDynamicImports: true,
      },
      plugins: [
        // bundleUserscript({ baseCSS: './src/base.css' })
      ]
    },
  },
  esbuild: {
    minifyIdentifiers: false,
    minifyWhitespace: false,
    keepNames: true,
  },
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
      ],
      dirs: [
        './src/composables',
        './src/utils',
      ],
    }),
    UnoCSS({
      mode: 'vue-scoped',
    }),
    // custom plugin
    (() => {
      /**
      * 如果用到了额外的 GM_functions，需要添加对应 @grant
      * 虽然可以全部不添加，但只有TamperMonkey会自动推断，其他扩展不一定
      * 在上面 extenral 声明的库，此处需要添加对应的 @require 要注意全局变量名称
      */
      const headers = `\
// ==UserScript==
// @name         石之家楼层显示fflogs数据
// @description  队伍招募时便捷查询，请勿滥用
// @version      2023-12-20
// @icon         https://ff14risingstones.web.sdo.com/pc/favicon.ico
// @namespace    https://github.com/UnluckyNinja
// @homepage     https://github.com/UnluckyNinja/risingstone-fflogs
// @author       UnluckyNinja
// @match        https://ff14risingstones.web.sdo.com/pc/index.html
// @connect      fflogs.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @sandbox      raw
// @license      MIT
// @noframes
// ==/UserScript==
`

      return {
        name: 'inject-css',
        apply: 'build', // 仅在构建模式下启用
        enforce: 'post', // 在最后处理
        generateBundle(options, bundle) {
          // 从 bundle 中提取 style.css 内容，并加入到脚本中
          const keyword = 'user.js'
          if (!bundle['style.css'] || bundle['style.css'].type !== 'asset') return
          const css = bundle['style.css'].source
          const [, target] = Object.entries(bundle).find(([name]) => {
            return name.includes(keyword)
          }) ?? []
          if (!target || target.type !== 'chunk') return
          target.code = `${headers}\nGM_addStyle(\`${css}\`);\n${target.code}`
        },
      }
    })(),
  ],
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
})
