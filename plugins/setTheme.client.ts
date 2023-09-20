export default defineNuxtPlugin((nuxtApp) => {
  const colorMode = useColorMode()

  // 页面加载完毕,如果是暗色模式则重新加载,见: https://github.com/tusen-ai/naive-ui/issues/3765#issuecomment-1283356344
  nuxtApp.hook('page:finish', () => {
    setTimeout(() => {
      colorMode.value = 'light'

      setTimeout(() => {
        colorMode.value = colorMode.preference
      }, 0)
    }, 0)
  })
})
