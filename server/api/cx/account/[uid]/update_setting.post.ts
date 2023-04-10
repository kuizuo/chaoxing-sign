import { IMConnectionMap, createIMConnection } from '~~/server/protocol/easemob'

interface Body {
  uid: string
  setting: API.Setting
}

export default defineEventHandler(async (event) => {
  const { setting } = await readBody<Body>(event)

  const account = await event.context.prisma.cxAccount.findUnique({
    where: {
      uid: event.context.cx.user.uid,
    },
  })

  if (!account)
    return ResOp.error(204, '账号不存在')

  const result = await event.context.prisma.cxAccount.update({
    where: {
      uid: event.context.cx.user.uid,
    },
    data: {
      setting: setting as any,
    },
  })

  if (setting.monitor) {
    if (!IMConnectionMap.has(event.context.cx.user.uid)) {
      const { uid, token } = await event.context.cx.getWebIM()

      const client = await createIMConnection()

      await client.open({
        user: uid,
        accessToken: token,
      })

      await handleListen(client, event.context.cx, account!)
    }
  }
  else {
    if (IMConnectionMap.has(event.context.cx.user.uid)) {
      const client = IMConnectionMap.get(event.context.cx.user.uid)!

      client.close()
    }
  }

  return ResOp.success(result.setting as unknown as API.Setting)
})
