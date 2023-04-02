import { CXMap } from '~~/server/protocol/cx'

export default defineEventHandler(async (event) => {
  const uid = event.context.cx.user?.uid

  await event.context.cx?.logout()

  CXMap.delete(uid)

  await event.context.prisma.cxAccount.delete({
    where: {
      uid,
    },
  })

  return new ResOp(200, null, '退出成功')
})
