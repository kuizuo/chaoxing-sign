export default defineNitroPlugin((_nitroApp) => {
  const runtimeConfig = useRuntimeConfig()

  if (runtimeConfig?.im?.initConnect) {
    const previousGlobalThis: any = { ...globalThis }
    initIMConnection().then(() => {
      Object.keys(global).forEach((k) => {
        if (previousGlobalThis[k])
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          global[k] = previousGlobalThis[k]
      })
    })
  }
})
