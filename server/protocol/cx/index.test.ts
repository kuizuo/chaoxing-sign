import { describe, expect, it } from 'vitest'
import { Cx } from '.'

const testAccount: Pick<CX.Account, 'username' | 'password'> = {
  username: process.env.CX_USERNAME!,
  password: process.env.CX_PASSWORD!,
}

describe('cx', async () => {
  const cx = new Cx(testAccount)
  let activityList: CX.Activity[] = []

  it('login', async () => {
    const result = await cx.login()

    console.log(result)
    console.log(cx.user)

    expect(result).toBe('登录成功')
    console.log('user', cx.user)
  })

  it('getCourseList', async () => {
    await cx.getCourseList()

    console.log(cx.courseList.length)
  })

  it('getActivity', async () => {
    const course = cx.courseList.find(c => c.name === '愧怍课程')!
    activityList = await cx.getActivityList(course)
    console.log(activityList.length)
  })

  it.skip('signGeneral', async () => {
    const result = await cx.signGeneral(activityList[0])
    console.log(result)
  })

  it.skip('getAllSignActivity', async () => {
    await cx.getAllActivity()
  })

  it.skip('getSignActivityList', async () => {
    const signActivity = await cx.getSignActivityList()
    console.log(signActivity.length)
  })

  it.skip('sign', async () => {
    await cx.oneClickSign()
  })
})
