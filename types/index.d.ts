declare namespace API {
  interface Result<T = any> {
    code: number
    message: string
    data: T
  }
}

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    im: {
      initConnect: boolean
    }
  }
}
