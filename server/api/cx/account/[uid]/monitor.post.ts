import { createIMConnection } from '~~/server/protocol/easemob'
import { handleListen } from '~~/server/utils/monitor'

export default defineEventHandler(async (event) => {
  const account = await event.context.prisma.cxAccount.findUnique({
    where: {
      uid: event.context.cx.user.uid,
    },
  })

  if ((account?.setting as unknown as API.Setting)?.monitor) {
    return ResOp.success({
      data: {
        isOpened: true,
      },
    }, '已监听')
  }

  const { uid, token } = await event.context.cx.getWebIM()

  const client = await createIMConnection()

  await client.open({
    user: uid,
    accessToken: token,
  })

  await handleListen(client, event.context.cx, account!)

  const isOpened = client.isOpened()

  return ResOp.success({
    data: {
      isOpened,
    },
  })
})
