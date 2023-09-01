import { describe, expect, it } from 'vitest'
import { Cx } from '.'
import 'dotenv/config'

const testAccount: Pick<CX.User, 'username' | 'password'> = {
  username: process.env.CX_USERNAME!,
  password: process.env.CX_PASSWORD!,
}

describe('cx', async () => {
  const cx = new Cx(testAccount)

  it('login', async () => {
    const result = await cx.login()

    expect(result).toBe('登录成功')
  })

  it('getPhotoFile', async () => {
    const file = await cx.getPhotoFile()
    console.log(file)

    expect(file).toBeDefined()
  })
})
