export default defineNitroPlugin((_nitroApp) => {
  const runtimeConfig = useRuntimeConfig()

  if (runtimeConfig?.im?.initConnect) {
    const previousGlobalThis: any = { ...globalThis }
    initIMConnection().then((result) => {
      if (result?.length > 0) {
        global.window = previousGlobalThis.window
        global.navigator = previousGlobalThis.navigator
        global.document = previousGlobalThis.document
        // global.WebSocket = previousGlobalThis.WebSocket
        // global.Image = previousGlobalThis.Image
        // global.history = previousGlobalThis.history
        // global.SVGElement = previousGlobalThis.SVGElement
        // global.XMLHttpRequest = previousGlobalThis.XMLHttpRequest
      }
    })
  }
})
