import { omit } from 'lodash-es'
import { getServerSession } from '#auth'
import { CXMap, Cx } from '~~/server/protocol/cx'
import { defaultSetting } from '~/constants/setting'

export interface Body extends Pick<CX.User, 'username' | 'password'> { }

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  const body = await readBody<Body>(event)

  // 判断该账号的某星账号是否大于 6 个，如果自行部署请注释下列代码
  const count = await event.context.prisma.cxAccount.count({
    where: {
      userId: session!.uid,
    },
  })

  if (count >= 6)
    throw createError({ statusMessage: '该账户已登录账号达到最大限制' })

  const cx = new Cx(body)
  const result = await cx.login()

  if (!cx.user.logged)
    return new ResOp(201, null, result!)

  CXMap.set(cx.user.username, cx)

  const account = await event.context.prisma.cxAccount.upsert({
    where: {
      uid: cx.user.uid,
    },
    update: {
      cookies: cx.getCookie('', 'json'),
      info: cx.user as any,
      lastLoginTime: new Date(),
      userId: session!.uid,
    },
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
    ...omit(account, 'password'),
    info: {
      ...omit(cx.user, 'password'),
    },
    lastLoginTime: account.lastLoginTime.toISOString(),
  }

  return ResOp.success(data, '登录成功')
})
