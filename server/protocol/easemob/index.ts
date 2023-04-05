import { createRequire } from 'module'
import type { EasemobChat, EasemobChatStatic } from 'easemob-websdk'
import WebSocket from 'ws'
import { JSDOM } from 'jsdom'

export interface OpenOptions {
  /** The User ID. */
  user: string
  /** The password. */
  pwd?: string
  /** Token required to connect to the message service. */
  accessToken?: string
  /** The Agora token. */
  agoraToken?: string
  success?: (res: any) => void
  error?: (res: any) => void
}

const previousGlobalThis = { ...globalThis }

export const createIMConnection = () => {
  const { window } = new JSDOM('', { url: 'https://im.chaoxing.com/webim/me' })

  const require = createRequire(import.meta.url)

  globalThis.window = window as unknown as typeof globalThis.window
  globalThis.navigator = window.navigator
  globalThis.document = window.document
  globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket
  globalThis.Image = window.Image
  globalThis.history = window.history
  globalThis.SVGElement = window.SVGElement
  globalThis.XMLHttpRequest = window.XMLHttpRequest

  // 不能使用 import，因为 easemob-websdk 会直接使用 window，因此需要在 globalThis.window 之后导入
  const Easemob = require('easemob-websdk')

  const { connection } = Easemob.default as EasemobChatStatic

  const conn: EasemobChat.Connection = new connection({
    url: 'https://im-api-vip6-v2.easecdn.com/ws',
    apiUrl: 'https://a1-vip6.easecdn.com',
    appKey: 'cx-dev#cxstudy',
    https: true,
    delivery: false,
    autoReconnectNumMax: 2,
  })

  // globalThis.window = previousGlobalThis.window
  // globalThis.navigator = previousGlobalThis.navigator
  globalThis.document = previousGlobalThis.document

  return conn
}

export const IMConnectionMap = new Map<string, EasemobChat.Connection>()
