import { omit } from 'lodash-es'
import dayjs from 'dayjs'
import { CXMap, Cx } from '~~/server/protocol/cx'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)!

  const accounts = await event.context.prisma.cxAccount.findMany({
    where: {
      User: {
        id: session!.uid,
      },
    },
    select: {
      uid: true,
      username: true,
      password: true,
      info: true,
      courses: true,
      setting: true,
      lastLoginTime: true,
      signlogs: true,
    },
    orderBy: {
      lastLoginTime: 'asc',
    },
  })

  // 判断账号上次登录时间大于 7 天,则触发重新登录
  const toReLoginAccounts = accounts.filter((account) => {
    return dayjs(account.lastLoginTime)
      .add(7, 'day')
      .isBefore(dayjs())
  })

  for await (const account of toReLoginAccounts) {
    const cx = new Cx({ username: account.username, password: account.password })

    await cx.login()

    if (cx.user.logged && cx.user.uid) {
      await prisma.cxAccount.update({
        where: {
          uid: cx.user.uid,
        },
        data: {
          cookies: cx.getCookie('', 'json') as any,
          info: cx.user as any,
          lastLoginTime: new Date(),
        },
      })

      if (CXMap.has(cx.user.username))
        CXMap.set(cx.user.username, cx)

      else
        CXMap.set(cx.user.username, cx)
    }
    else {
      if (CXMap.has(cx.user.username))
        CXMap.delete(cx.user.username)
    }
  }

  const data = accounts.map((account) => {
    return omit(account, ['password'])
  })

  return ResOp.success(data)
})
