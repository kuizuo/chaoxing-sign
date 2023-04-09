import { IMConnectionMap } from '~~/server/protocol/easemob'

export default defineEventHandler(async (event) => {
  const account = await event.context.prisma.cxAccount.findUnique({
    where: {
      uid: event.context.cx.user.uid,
    },
  })

  await event.context.prisma.cxAccount.update({
    where: {
      uid: event.context.cx.user.uid,
    },
    data: {
      setting: {
        ...(account?.setting as any),
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
