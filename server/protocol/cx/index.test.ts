import { describe, expect, it } from 'vitest'
import { ActivityStatusEnum, ActivityTypeEnum } from './constant'
import { Cx } from '.'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const testAccount: Pick<CX.User, 'username' | 'password'> = {
  username: process.env.CX_USERNAME!,
  password: process.env.CX_PASSWORD!,
}

describe('cx', async () => {
  const cx = new Cx(testAccount)
  let activityList: CX.ActivityItem[] = []

  it('login', async () => {
    const result = await cx.login()

    console.log(result)
    console.log(cx.user)

    expect(result).toBe('登录成功')
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

  it.skip('signNormal', async () => {
    const result = await cx.signNormal(activityList[0])
    console.log(result)
  })

  it.skip('getAllSignActivity', async () => {
    await cx.getAllActivity()
  })

  it.skip('getSignActivityList', async () => {
    const signActivityList = await cx.getAllActivity(ActivityTypeEnum.Sign, ActivityStatusEnum.Doing)

    console.log(signActivityList.length)
  })

  it.skip('sign', async () => {
    await cx.oneClickSign()
  })
})
