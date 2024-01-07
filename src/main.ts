import { createApp } from 'vue'
import './fflogs.css'
import './ff-job.css'
import App from './App.vue'

// 插入vue实例
function insertInstances(commentEle: Element) {
  const children = commentEle.querySelectorAll('div.flex.alcenter:has(~ div.dobans)')
  for (let child of children) {
    const ins = document.createElement('div')
    child.appendChild(ins)
    const charName = child.querySelector('div.name span.cursor')?.textContent
    const serverName = child.querySelector('span.group')?.textContent
    if (charName && serverName) {
      createApp(App, {
        charName,
        serverName,
      }).mount(ins)
    }
  }
}
function insertInstanceAtOP(target: Element) {
  const ins = document.createElement('div')
  target.appendChild(ins)
  const charName = target.querySelector('span:nth-child(1)')?.textContent
  const serverName = target.querySelector('span:nth-child(2) > span > span:nth-child(2)')?.textContent
  if (charName && serverName) {
    createApp(App, {
      charName,
      serverName,
    }).mount(ins)
  }
}

// 监控评论列表
const observer = new MutationObserver((mutations, obs) => {
  for (const m of mutations) {
    if (m.type !== 'childList') {
      continue
    }
    console.log('监听到评论列表更新')
    for (const child of m.addedNodes) {
      if ((child.nodeType & child.ELEMENT_NODE) !== 0) {
        insertInstances(child as Element)
      }
    }
  }
})

// 监控页面，搜索评论列表
const rootObserver = new MutationObserver((mutations, obs) => {
  outer:
  for (const m of mutations) {
    if (m.target.nodeType === Node.ELEMENT_NODE) {
      // 点开帖子时
      for (const child of m.addedNodes) {
        if (child.nodeType !== Node.ELEMENT_NODE) continue
        const e = child as Element
        const e1 = e.querySelector('#comment')
        if (e1) {
          console.log('监听到评论列表出现')
          // for (const child of e1.children) {
          insertInstances(e1)
          // }
          observer.observe(e1, {
            childList: true,
            subtree: true,
          })
        }
        // 主楼
        const e2 = e.querySelector('div.detail div.flex.alcenter')
        if (e2) {
          console.log('监听到主楼出现')
          insertInstanceAtOP(e2)
        }
      }
      // 跳转非帖子页面
      for (const child of m.removedNodes) {
        if (child.nodeType !== Node.ELEMENT_NODE) continue
        const e = child as Element
        const e1 = e.querySelector('#comment')
        if (e1) {
          console.log('监听到评论列表被移除，停止原先的监听评论列表')
          observer.disconnect()
          break outer
        }
      }
    }
  }
})

const commentEle = document.querySelector('#comment')
if (commentEle) {
  console.log('找到评论列表元素，处理已有评论')
  // 脚本加载前已存在评论列表的情况
  // for (const child of commentEle.children) {
  insertInstances(commentEle)
  // }
  observer.observe(commentEle, {
    childList: true,
    subtree: true,
  })
}
const opEle = document.querySelector('div.detail div.flex.alcenter')
if (opEle) {
  console.log('已找到并处理主楼')
  // 脚本加载前已存在主楼的情况
  insertInstanceAtOP(opEle)
}

rootObserver.observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
})
