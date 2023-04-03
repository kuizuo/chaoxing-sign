import { acceptHMRUpdate } from 'pinia'
import type { MessageOptions } from 'naive-ui'

export const useLogStore = defineStore('log', () => {
  const logList = useLocalStorage<string[]>('log', []) // reactive<string[]>([])
  const showLog = ref(true)
  const message = useMessage()

  function log(content: string, options: MessageOptions) {
    const formatted = useDateFormat(useNow(), 'HH:mm:ss').value

    const info = `${formatted} ${content}`
    console.log(`${formatted} ${info}`)

    if (options)
      message.create(content, options)

    logList.value.push(info)
  }

  function cleanLog() {
    logList.value = []
    log('日志已清空', { type: 'success' })
  }

  return {
    logList,
    log,
    showLog,
    cleanLog,
  }
}, {
  persist: true,
})

if (import.meta.hot) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  import.meta.hot.accept(acceptHMRUpdate(useLogStore, import.meta.hot))
}

