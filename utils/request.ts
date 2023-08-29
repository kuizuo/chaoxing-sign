import { createDiscreteApi } from 'naive-ui'

const { message } = createDiscreteApi(
  ['message'],
)

export function getHeaders(defaultHeaders = {}) {
  return {
    ...defaultHeaders,
    // Authorization: useUserStore()?.token
  }
}

const _fetch = $fetch.create({
  async onRequest({ options }) {
    options.headers = getHeaders(options.headers)
  },
  async onResponse() {
  },
  async onResponseError({ response, options }) {
    options?.params?.noMessage || message.error(response._data.message || '服务器错误')
  },
})

const request = _fetch
// export const request = (...args: Parameters<typeof _fetch>): ReturnType<typeof _fetch> => _fetch(...args)
export default request
