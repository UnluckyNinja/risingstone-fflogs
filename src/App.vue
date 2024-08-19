<script setup lang="ts">
import { getLogsProfileURL } from './utils/fflogs'

const props = withDefaults(defineProps<{
  charName?: string,
  serverName?: string
}>(), {
  charName: '',
  serverName: ''
})

const compRoot = ref(null)
const panel = ref(null)

const rootHovered = useElementHover(compRoot, { delayEnter: 500 })
const panelHovered = useElementHover(panel, { delayLeave: 200 })

const propsValid = computed(() => {
  return props.charName && props.serverName
})
const displayPanel = computed(() => {
  return propsValid.value && (rootHovered.value || panelHovered.value)
})

const promise = ref<Promise<any> | null>(null)
const status = ref('正在查询数据……')
const fetched = ref(false)

const table = ref<Element | null>(null)
watch(displayPanel, (newVal) => {
  if (newVal === true && !promise.value) {
    promise.value = getCharacterID(props.serverName, props.charName).then(ID => {
      if (!ID) {
        status.value = '未查询到该角色的记录'
        throw new Error('Not found')
      }
      return getCharacterLogsData(ID, gameVersions[0].children[0].id)
    }).then(parsedTable => {
      if (!parsedTable) {
        status.value = '未请求到数据'
        fetched.value = true
        return
      }
      status.value = ''
      fetched.value = true
      // 父元素必须为静态内容
      table.value!.appendChild(parsedTable)
    })
  }
})

</script>

<template>
  <div ref="compRoot" class="relative mx-2">
    <div class="trigger text-cyan-7 cursor-pointer">{{ propsValid ? '鼠标悬浮此处查看FFlogs数据' : '未能识别角色名或服务器' }}</div>
    <div ref="panel" v-show="displayPanel" class="absolute left-0 top-0 border border-solid rounded p-2 bg-white z-10">
      <!-- <LogsTable :char-name="props.charName" :server-name="props.serverName" /> -->
      <div>
        <span class="font-bold">
          服务器：
        </span>
        {{ props.serverName }}
        <br>
        <span class="font-bold">角色名：</span>
        {{ props.charName }}
      </div>

      <div>
        {{ status }}
      </div>
      <a v-if="fetched" :href="getLogsProfileURL(props.serverName, props.charName)" target="_blank">查看角色FFlogs主页</a>
      <div ref="table" class="relative bg-white z-20"></div>
    </div>
  </div>
</template>

<style scoped>
.trigger {
  position: relative;
  background-color: transparent;
  overflow: hidden;
  z-index: 1;
}

.trigger::after {
  content: ' ';
  background-color: lightskyblue;
  position: absolute;
  right: 100%;
  width: 100%;
  height: 100%;
  transition: right 0s;
  z-index: -1;
}

.trigger:hover::after {
  right: 0%;
  transition: right 0.5s linear;
}
</style>
