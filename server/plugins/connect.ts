export default defineNitroPlugin((nitroApp) => {
  const previousGlobalThis: any = { ...globalThis }
  initIMConnection().then(() => {
    Object.keys(global).forEach((k) => {
      if (previousGlobalThis[k])
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        global[k] = previousGlobalThis[k]
    })
  })
})
