import { IMConnectionMap } from '~~/server/protocol/easemob'

export default defineEventHandler(async (event) => {
  await event.context.prisma.cxAccount.update({
    where: {
      uid: event.context.cx.user.uid,
    },
    data: {
      setting: {
        monitor: false,
      },
    },
  })

  if (IMConnectionMap.has(event.context.cx.user.uid)) {
    const client = IMConnectionMap.get(event.context.cx.user.uid)!

    client.close()
  }

  return ResOp.success({
    data: {
      isOpened: false,
    },
  })
})
