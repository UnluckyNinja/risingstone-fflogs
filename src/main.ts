import { createApp } from 'vue'
import './fflogs.css'
import './ff-job.css'
import App from './App.vue'

console.log('running')

// 插入vue实例
function insertInstances(childComment: Element) {
  const ins = document.createElement('div')
  childComment.querySelector('div.flex.alcenter')?.appendChild(ins)
  const charName = childComment.querySelector('div.name span.cursor')?.textContent
  const serverName = childComment.querySelector('span.group')?.textContent
  createApp(App, {
    charName,
    serverName,
  }).mount(ins)
}
function insertInstanceAtOP(target: Element) {
  const ins = document.createElement('div')
  target.appendChild(ins)
  const charName = target.querySelector('span:nth-child(1)')?.textContent
  const serverName = target.querySelector('span:nth-child(2) > span > span:nth-child(2)')?.textContent
  createApp(App, {
    charName,
    serverName,
  }).mount(ins)
}

// 监控评论列表
const observer = new MutationObserver((mutations, obs) => {
  for (const m of mutations) {
    if (m.type !== 'childList') {
      continue
    }
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
          for (const child of e1.children) {
            insertInstances(child)
          }
          observer.observe(e1, {
            childList: true,
          })
          break outer
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
  for (const child of commentEle.children) {
    insertInstances(child)
  }
  observer.observe(commentEle, {
    childList: true,
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
