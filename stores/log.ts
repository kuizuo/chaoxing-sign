import type { MessageOptions } from 'naive-ui'

export const useLogStore = defineStore('log', () => {
  const logList = reactive<string[]>([])
  const showLog = ref(true)
  const message = useMessage()

  const log = (content: string, options: MessageOptions) => {
    const formatted = useDateFormat(useNow(), 'HH:mm:ss').value

    const info = `${formatted} ${content}`
    console.log(`${formatted} ${info}`)

    if (options)
      message.create(content, options)

    logList.push(info)
  }

  return {
    logList,
    log,
    showLog,
  }
}, {
  persist: {
    key: 'log',
  },
})
