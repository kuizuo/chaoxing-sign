import _ from 'lodash'
import { getServerSession } from '#auth'
import { CXMap, Cx } from '~~/server/protocol/cx'
import { defaultSetting } from '~~/constants/setting'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  const body = await readBody<API.LoginForm>(event)

  const cx = new Cx(body)
  const result = await cx.login()

  if (!cx.user.logged)
    return new ResOp(201, null, result!)

  CXMap.set(cx.user.username, cx)

  const account = await event.context.prisma.cxAccount.upsert({
    where: {
      uid: cx.user.uid,
    },
    update: { cookies: cx.getCookie('', 'json'), info: cx.user as any, lastLoginTime: new Date() },
    create: {
      uid: cx.user.uid,
      username: cx.user.username,
      password: cx.user.password,
      info: cx.user as any,
      cookies: cx.getCookie('', 'json'),
      setting: defaultSetting as any,
      lastLoginTime: new Date(),
      userId: session!.uid,
    },
  })

  const data = {
    ..._.omit(account, 'password'),
    info: {
      ..._.omit(cx.user, 'password'),
    },
    lastLoginTime: account.lastLoginTime.toISOString(),
  }
  return ResOp.success(data, '登录成功')
})
