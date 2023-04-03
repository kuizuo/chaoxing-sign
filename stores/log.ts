import type { MessageOptions } from 'naive-ui'

export const useLogStore = defineStore('log', () => {
  const logList = reactive<string[]>([])
  const showLog = ref(true)
  const message = useMessage()

  function log(content: string, options: MessageOptions) {
    const formatted = useDateFormat(useNow(), 'HH:mm:ss').value

    const info = `${formatted} ${content}`
    console.log(`${formatted} ${info}`)

    if (options)
      message.create(content, options)

    logList.push(info)
  }

  function cleanLog() {
    logList.length = 0
    log('日志已清空', { type: 'success' })
  }

  return {
    logList,
    log,
    showLog,
    cleanLog,
  }
}, {
  persist: {
    key: 'log',
  },
})
