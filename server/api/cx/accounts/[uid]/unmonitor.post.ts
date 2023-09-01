import { IMConnectionMap } from '~~/server/protocol/easemob'

export default defineEventHandler(async (event) => {
  const account = await event.context.prisma.cxAccount.findUnique({
    where: {
      uid: event.context.cx.user.uid,
    },
  })

  if ((account?.setting as any)?.monitor) {
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
  }

  if (IMConnectionMap.has(event.context.cx.user.uid)) {
    const client = IMConnectionMap.get(event.context.cx.user.uid)!

    client.close()

    IMConnectionMap.delete(event.context.cx.user.uid)
  }

  return ResOp.success({
    data: {
      isOpened: false,
    },
  })
})
