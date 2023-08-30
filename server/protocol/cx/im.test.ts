import { describe, expect, it } from 'vitest'
import type { EasemobChat } from 'easemob-websdk'
import type { OpenOptions } from '../easemob'
import { createIMConnection } from '../easemob'
import { Cx } from '.'
import 'dotenv/config'

const testAccount: Pick<CX.User, 'username' | 'password'> = {
  username: process.env.CX_USERNAME!,
  password: process.env.CX_PASSWORD!,
}

describe('cx-im', async () => {
  const cx = new Cx(testAccount)
  let client: EasemobChat.Connection
  let imUser: OpenOptions = {
    user: '',
  }

  it('login', async () => {
    const result = await cx.login()

    console.log(result)

    expect(result).toBe('登录成功')
    console.log('user', cx.user)
  })

  it('getWebIM', async () => {
    const { uid, name, token } = await cx.getWebIM()

    console.log(uid, name, token)
    imUser = { user: uid, accessToken: token }

    expect(uid).toBeTruthy()
  })

  it('conn', async () => {
    client = await createIMConnection()

    console.log(client)
    expect(client.appKey).toBe('cx-dev#cxstudy')
  })

  it('open', async () => {
    await client.open(imUser)
  })

  it('listen', async () => {
    const result = await new Promise((resolve, reject) => {
      client.listen({
        onOpened: () => {
          console.log('onOpened')
          resolve(client)
        },
        onClosed: () => {
          console.log('onClosed')
        },
        onError: (error) => {
          console.log('onError', error)
          reject(error)
        },
        onTextMessage: async (message) => {
          console.log(message)
        },
      })
    })

    expect(result).toBe(client)
  })
})
