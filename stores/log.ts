import type { MessageType } from 'naive-ui'

export const useLogStore = defineStore('log', () => {
  const logList = reactive<string[]>([])
  const showLog = ref(true)
  const message = useMessage()

  const log = (content: string, type: MessageType | null = null) => {
    const formatted = useDateFormat(useNow(), 'HH:mm:ss').value

    const info = `${formatted} ${content}`
    console.log(`${formatted} ${info}`)

    if (type)
      message.create(content, { type })

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
