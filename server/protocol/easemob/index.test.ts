import { describe, expect, it } from 'vitest'
import { createIMConnection } from '.'

// 环信 IM SDK https://www.npmjs.com/package/easemob-websdk
describe('easemob', async () => {
  it('conn', async () => {
    const account = {
      user: process.env.EASEMOB_USER!,
      accessToken: process.env.EASEMOB_ACCESSToken!,
    }
    const client = await createIMConnection()

    client.open(account)

    expect(client).toBeTruthy()
  })
})
